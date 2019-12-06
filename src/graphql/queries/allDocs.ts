import { gql } from 'apollo-server-core'
import { createResolverFunction } from '../../util/createResolverFunction'
import { allDocs } from '../../couchdb/allDocs'

export const typeDefs = gql`
  type AllDocsRow {
    id: String!
    rev: String
    value: JSON
    doc: JSON
  }

  type AllDocsResponse {
    total_rows: Int!
    offset: Int!
    rows: [AllDocsRow!]!
  }

  extend type Query {
    allDocs(
      conflicts: Boolean
      endkey: JSON
      include_docs: Boolean
      inclusive_end: Boolean
      key: JSON
      keys: [JSON!]
      limit: Int
      skip: Int
      startkey: JSON
      update_seq: Boolean
    ): AllDocsResponse
  }
`

export const resolvers = {
  Query: {
    allDocs: createResolverFunction((parent, args, context, info) => {
      return allDocs(context, args)
    }),
  },
}
