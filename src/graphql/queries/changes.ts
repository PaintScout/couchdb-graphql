import { gql } from 'apollo-server-core'
import getAxios from '../../util/getAxios'
import queryString from 'qs'
import createResolver from '../../util/createResolver'

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

export const resolvers = createResolver({
  Query: {
    changes: async (parent, args, context, info) => {
      const hasArgs = Object.keys(args).length > 0
      let url = `${context.dbUrl}/${context.dbName}/_changes`

      if (hasArgs) {
        if (args.lastEventId) {
          delete args.lastEventId
          args['last-event-id'] = args.lastEventId
        }

        // if args.since is not 'now', convert to number
        if (args.since) {
          if (args.since !== 'now') {
            args.since = parseInt(args.since)
          }
        }

        url += `?${queryString.stringify(args)}`
      }

      const response = await getAxios(context).get(url)

      return response.data
    },
  },
})
