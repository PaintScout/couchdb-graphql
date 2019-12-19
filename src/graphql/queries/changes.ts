import { gql } from 'apollo-server-core'

import { createResolver } from '../../util/createResolver'
import { changes } from '../../couchdb/changes'

export const typeDefs = gql`
  type Change {
    rev: String
  }
  type ChangesResult {
    changes: [Change]
    id: String
    seq: JSON
    doc: JSON
    deleted: Boolean
  }

  type ChangesResponse {
    last_seq: JSON
    pending: Int
    results: [ChangesResult]
  }

  extend type Query {
    changes(
      doc_ids: [String!]
      conflicts: Boolean
      descending: Boolean
      feed: String
      filter: String
      heartbeat: Int
      include_docs: Boolean
      attachments: Boolean
      att_encoding_info: Boolean
      lastEventId: Int
      limit: Int
      since: String
      timeout: Int
      view: String
      seq_interval: Int
    ): ChangesResponse
  }
`

export const resolvers = {
  Query: {
    changes: createResolver((parent, args, context, info) => {
      return changes(context, args)
    }),
  },
}
