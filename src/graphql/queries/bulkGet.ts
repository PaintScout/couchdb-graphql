import { gql } from 'apollo-server'
import axios from 'axios'
import queryString from 'query-string'
import createResolver from '../../util/createResolver'

/**
 * Generic GET on a document
 */
export const typeDefs = gql`
  input BulkGetInput {
    id: String!
    rev: String
  }

  type BulkGetResponse {
    results: [BulkGetResult]
  }

  type BulkGetResult {
    id: String
    docs: [BulkGetDocs!]!
  }

  type BulkGetDocs {
    ok: JSON
    error: BulkGetError
  }

  type BulkGetError {
    id: String
    rev: String
    error: String
    reason: String
  }

  extend type Query {
    bulkGet(docs: [BulkGetInput!]!, revs: Boolean): BulkGetResponse
  }
`

export const resolvers = createResolver({
  Query: {
    bulkGet: async (parent, { docs, revs }, context, info) => {
      let url = `${context.dbUrl}/_bulk_get`

      if (revs) {
        url += `?${queryString.stringify({ revs })}`
      }

      const response = await axios.post(url, {
        docs,
        revs,
      })

      return response.data
    },
  },
})
