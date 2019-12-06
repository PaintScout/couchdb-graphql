import { gql } from 'apollo-server-core'
import { createResolverFunction } from '../../util/createResolverFunction'
import { bulkDocs } from '../../couchdb/bulkDocs'

export const typeDefs = gql`
  type BulkDocsResponseObject {
    _id: String
    _rev: String
    document: JSON
    error: String
    reason: String
  }

  extend type Mutation {
    bulkDocs(
      input: [JSON!]!
      upsert: Boolean
      new_edits: Boolean
    ): [BulkDocsResponseObject]
  }
`

export const resolvers = {
  Mutation: {
    bulkDocs: createResolverFunction(
      (parent, { input, upsert, new_edits = true }, context, info) => {
        return bulkDocs(context, input, { upsert, new_edits })
      }
    ),
  },
}
