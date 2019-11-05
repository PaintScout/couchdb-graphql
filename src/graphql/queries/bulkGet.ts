import { gql } from 'apollo-server-core'
import { createResolver } from '../../util/createResolver'
import { bulkGet } from '../../couchdb/bulkGet'

/**
 * Generic GET on a document
 */
export const typeDefs = gql`
  input BulkGetInput {
    id: String!
    rev: String
  }

  type BulkGetResponse {
    results: [BulkGetResult!]!
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
      return bulkGet(docs, context, { revs })
    },
  },
})
