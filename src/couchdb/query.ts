import queryString from 'qs'
import { CouchDbContext } from '../createContext'
import parseFetchResponse from '../util/parseFetchResponse'

export interface QueryOptions {
  ddoc: string
  view: string
  conflicts?: boolean
  descending?: boolean
  endkey?: any | any[]
  group?: boolean
  group_level?: number
  include_docs?: boolean
  attachments?: boolean
  att_encoding_info?: boolean
  inclusive_end?: boolean
  key?: any | any[]
  keys?: any | any[]
  limit?: number
  reduce?: boolean
  skip?: number
  sorted?: boolean
  stable?: boolean
  stale?: string
  startkey?: any | any[]
  update?: string
  update_seq?: boolean
}

export interface QueryResponse<T> {
  offset: number
  update_seq: any | any[]
  total_rows: number
  rows: Array<{
    id: string
    key?: any | any[]
    value?: any
    doc?: T
  }>
}
export async function query<T = any>(
  context: CouchDbContext,
  { view, ddoc, key, keys, ...options }: QueryOptions
): Promise<QueryResponse<T>> {
  const { fetch, dbUrl, dbName, onDocumentsSaved } = context.couchDb
  const postOptions = { key, keys }

  let url = `${dbUrl}/${dbName}/_design/${ddoc}/_view/${view}`

  if (options) {
    url += `?${queryString.stringify(options)}`
  }

  const hasArgs = Object.keys(postOptions).length > 0
  const fetchOptions: any = {}
  if (hasArgs) {
    fetchOptions.method = 'POST'
    fetchOptions.body = JSON.stringify(postOptions)
    fetchOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }

  const response = await fetch(url, fetchOptions)
    .then(parseFetchResponse)
    .catch(err => {
      err.stack = new Error(err.message).stack + (err.stack ?? '')
      err.body = fetchOptions.body
      throw err
    })

  return response
}
