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
    value?: T
  }>
}
export async function query<T = any>(
  context: CouchDbContext,
  { view, ddoc, ...options }: QueryOptions
): Promise<QueryResponse<T>> {
  const { fetch, dbUrl, dbName, onDocumentsSaved } = context.couchDb

  let url = `${dbUrl}/${dbName}/_design/${ddoc}/_view/${view}`

  const stringifyKeys = ['key', 'keys'].forEach(key => {
    options[key] = JSON.stringify(options[key])
  })

  const hasArgs = Object.keys(options).length > 0
  if (hasArgs) {
    url += `?${queryString.stringify(options)}`
  }

  const response = await fetch(url).then(parseFetchResponse)

  return response
}
