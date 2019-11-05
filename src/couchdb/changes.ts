import { gql } from 'apollo-server-core'
import getAxios from '../util/getAxios'
import queryString from 'qs'
import { CouchDbContext } from '../util/createResolver'

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

export interface ChangesOptions {
  doc_ids?: string[]
  conflicts?: boolean
  descending?: boolean
  feed?: string
  filter?: string
  heartbeat?: number
  include_docs?: boolean
  attachments?: boolean
  att_encoding_info?: boolean
  lastEventId?: number
  limit?: number
  since?: string | number
  timeout?: number
  view?: string
  seq_interval?: number
}
export async function changes(
  context: CouchDbContext,
  options: ChangesOptions
) {
  const hasArgs = Object.keys(options).length > 0
  let url = `${context.dbUrl}/${context.dbName}/_changes`

  if (hasArgs) {
    if (options.lastEventId) {
      delete options.lastEventId
      options['last-event-id'] = options.lastEventId
    }

    // if options.since is not 'now', convert to number
    if (options.since && options.since !== 'now') {
      options.since = parseInt(options.since as string)
    }

    url += `?${queryString.stringify(options)}`
  }

  const response = await getAxios(context).get(url)

  return response.data
}
