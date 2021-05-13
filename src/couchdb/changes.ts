import queryString from 'qs'
import { CouchDbContext } from '../createContext'
import parseFetchResponse from '../util/parseFetchResponse'

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

export interface ChangesResponse {
  last_seq: any
  pending: number
  results: Array<{
    changes: Array<{ rev: string }>
    id: string
    seq: any
    doc: any
    deleted?: boolean
  }>
}
export async function changes(
  context: CouchDbContext,
  options: ChangesOptions
): Promise<ChangesResponse> {
  const { fetch, dbUrl, dbName } = context.couchDb
  const hasArgs = Object.keys(options).length > 0
  let url = `${context}/${context}/_changes`

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

  const response = await fetch(url)
    .then(parseFetchResponse)
    .catch(err => {
      err.stack = new Error(err.message).stack + (err.stack ?? '')

      throw err
    })

  return response
}
