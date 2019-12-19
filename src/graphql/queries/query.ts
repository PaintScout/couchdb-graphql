import { gql } from 'apollo-server-core'
import { createResolver } from '../../util/createResolver'
import { query, QueryOptions } from '../../couchdb/query'

export const typeDefs = gql`
  type QueryResponse {
    offset: Int
    update_seq: JSON
    total_rows: Int
    rows: [QueryRow!]
  }

  type QueryRow {
    id: String
    key: JSON
    value: JSON
  }

  extend type Query {
    query(
      ddoc: String!
      view: String!
      conflicts: Boolean
      descending: Boolean
      endkey: JSON
      group: Boolean
      group_level: Int
      include_docs: Boolean
      attachments: Boolean
      att_encoding_info: Boolean
      inclusive_end: Boolean
      key: JSON
      keys: [JSON!]
      limit: Int
      reduce: Boolean
      skip: Int
      sorted: Boolean
      stable: Boolean
      stale: String
      startkey: JSON
      update: String
      update_seq: Boolean
    ): QueryResponse
  }
`

export const resolvers = {
  Query: {
    query: createResolver<QueryOptions>(async (parent, args, context, info) => {
      return query(context, args)
    }),
  },
}
