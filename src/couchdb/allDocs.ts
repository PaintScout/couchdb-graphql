import queryString from 'qs'
import getAxios from '../util/getAxios'
import { CouchDbContext } from '../util/createResolver'

export interface AllDocsOptions {
  conflicts?: boolean
  endkey?: any | any[]
  include_docs?: boolean
  inclusive_end?: boolean
  key?: any | any[]
  keys?: any | any[]
  limit?: number
  skip?: number
  startkey?: any | any[]
  update_seq?: boolean
}

export interface AllDocsResponse<T = any> {
  total_rows: number
  offset: number
  rows: Array<{
    id: string
    rev?: string
    value?: {
      rev: string
    }
    doc?: T
  }>
}

export async function allDocs<T = any>(
  context: CouchDbContext,
  { keys, key, endkey, startkey, ...args }: AllDocsOptions = {}
): Promise<AllDocsResponse<T>> {
  let url = `${context.dbUrl}/${context.dbName}/_all_docs`

  if (args) {
    url += `?${queryString.stringify(args)}`
  }

  const response = await getAxios(context).post(url, {
    keys,
    key,
    endkey,
    startkey,
  })

  return response.data
}
