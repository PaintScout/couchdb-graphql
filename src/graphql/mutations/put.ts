import { gql } from 'apollo-server'
import axios from 'axios'
import queryString from 'query-string'

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

export const resolvers = {
  Mutation: {
    put: async (parent, { input, upsert, new_edits }, context, info) => {
      let url = `${context.dbUrl}/_bulk_docs`
      let rev = input._rev

      // get previous _rev for upsert
      if (upsert) {
        if (!input._id) {
          throw Error('upsert option requires input to contain _id')
        }

        try {
          const {
            data: { _rev },
          } = await axios.get(`${context.dbUrl}/${input._id}`)
          rev = _rev
        } catch (e) {
          if (e.status !== 404) {
            throw e
          }
        }
      }

      const response = await axios.post(url, {
        docs: [{ ...input, _rev: rev }],
        new_edits,
      })

      const [result] = response.data

      if (result.error) {
        console.error(result.error + ': ' + result.reason)
        throw new Error(result.reason)
      }

      return {
        _id: result.id,
        _rev: result.rev,
        document: {
          ...input,
          _id: result.id,
          _rev: result.rev,
        },
      }
    },
  },
}
