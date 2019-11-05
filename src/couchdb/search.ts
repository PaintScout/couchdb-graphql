import { gql } from 'apollo-server-core'
import getAxios from '../util/getAxios'
import { CouchDbContext } from '../util/createResolver'

export interface SearchOptions {
  index: string
  ddoc: string
  query: string
  bookmark?: string
  counts?: string[]
  drilldown?: any
  group_field?: string
  group_limit?: number
  group_sort?: any
  highlight_fields?: string[]
  highlight_pre_tag?: string
  highlight_post_tag?: string
  highlight_number?: number
  highlight_size?: number
  include_docs?: boolean
  include_fields?: string[]
  limit?: number
  ranges?: any
  sort?: string | string[]
  stale?: string
}

export interface SearchResponse {
  total_rows: number
  bookmark: string
  rows: Array<{
    id: String
    order: number[]
    fields: Record<string, any>
  }>
  counts?: any
}

export async function search(
  context: CouchDbContext,
  { index, ddoc, ...options }: SearchOptions
) {
  let url = `${context.dbUrl}/${context.dbName}/_design/${ddoc}/_search/${index}`

  const response = await getAxios(context).post(url, options)

  return response.data
}
