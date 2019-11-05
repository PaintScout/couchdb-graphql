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

      const result = await getAxios(context)
        .post(url, {
          docs: [{ ...input, _rev: rev }],
          new_edits,
        })
        .then(async res => {
          const [result] = res.data

          // resolve conflicts
          if (result && result.id && result.error === 'conflict') {
            const resolved = await resolveConflicts([input], context)

            return resolved[0]
          }

          return result
        })

      if (result && result.error) {
        throw new Error(result.reason)
      }

      if (result) {
        const savedDocument = result && {
          ...input,
          _id: result.id,
          _rev: result.rev,
        }

        if (context.onDocumentsSaved) {
          context.onDocumentsSaved([savedDocument])
        }

        return {
          _id: result.id,
          _rev: result.rev,
          document: savedDocument,
        }
      } else {
        // new_edits=false returns empty response
        return {}
      }
    },
  },
})
