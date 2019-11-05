import { gql } from 'apollo-server-core'
import { createResolver } from '../../util/createResolver'
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

export const resolvers = createResolver({
  Mutation: {
    bulkDocs: async (
      parent,
      { input, upsert, new_edits = true },
      context,
      info
    ) => {
      return bulkDocs(input, context, { upsert, new_edits })
    },
  },
})
