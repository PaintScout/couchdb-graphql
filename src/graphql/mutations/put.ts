import { gql } from 'apollo-server-core'
import getAxios from '../../util/getAxios'
import { createResolver } from '../../util/createResolver'
import { resolveConflicts } from '../../util/resolveConflicts'

/**
 * PUTs a document using _bulk_docs endpoint
 */
export const typeDefs = gql`
  type PutResponse {
    _id: String!
    _rev: String
    document: JSON
  }

  extend type Mutation {
    put(input: JSON, upsert: Boolean, new_edits: Boolean): PutResponse
  }
`

export const resolvers = createResolver({
  Mutation: {
    put: async (parent, { input, upsert, new_edits = true }, context, info) => {
      let url = `${context.dbUrl}/${context.dbName}/_bulk_docs`
      let rev = input._rev

      // get previous _rev for upsert
      if (upsert) {
        if (!input._id) {
          throw Error('upsert option requires input to contain _id')
        }

        try {
          const {
            data: { _rev },
          } = await getAxios(context).get(
            `${context.dbUrl}/${context.dbName}/${encodeURIComponent(
              input._id
            )}`
          )
          rev = _rev
        } catch (e) {
          if (!e.response || e.response.status !== 404) {
            throw e
          }
        }
      }

      const response = await getAxios(context).post(url, {
        docs: [{ ...input, _rev: rev }],
        new_edits,
      })

      let [result] = response.data

      if (result && result.error) {
        if (result.error === 'conflict' && result.id) {
          const resolved = await resolveConflicts([input], context)

          if (resolved) {
            result = resolved[0]
          }

          if (result.error) {
            throw new Error(result.reason)
          }
        } else {
          throw new Error(result.reason)
        }
      }

      return result
        ? {
            _id: result.id,
            _rev: result.rev,
            document: {
              ...input,
              _id: result.id,
              _rev: result.rev,
            },
          }
        : {}
    },
  },
})
