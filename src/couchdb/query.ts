import queryString from 'qs'
import { CouchDbContext } from '../util/createResolver'
import getAxios from '../util/getAxios'

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
  keys: any | any[]
  limit?: number
  reduce?: boolean
  skip?: number
  sorted?: boolean
  stable?: boolean
  stale: string
  startkey?: any | any[]
  update?: string
  update_seq?: boolean
}

export interface QueryResponse {
  offset: number
  update_seq: any | any[]
  total_rows: number
  rows: Array<{
    id: string
    key?: any | any[]
    value?: any
  }>
}
export async function query(
  context: CouchDbContext,
  { view, ddoc, ...options }: QueryOptions
): Promise<QueryResponse> {
  let url = `${context.dbUrl}/${context.dbName}/_design/${ddoc}/_view/${view}`

  const hasArgs = Object.keys(options).length > 0
  if (hasArgs) {
    url += `?${queryString.stringify(options)}`
  }

  const response = await getAxios(context).get(url)

  return response.data
}
