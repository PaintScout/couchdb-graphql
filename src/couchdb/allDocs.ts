import queryString from 'qs'
import { CouchDbContext } from '../createContext'
import parseFetchResponse from '../util/parseFetchResponse'

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
  const { fetch } = context.couchDb
  let url = `${context.couchDb.dbUrl}/${context.couchDb.dbName}/_all_docs`

  if (args) {
    url += `?${queryString.stringify(args)}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      keys,
      key,
      endkey,
      startkey,
    }),
  })
    .then(parseFetchResponse)
    .catch(err => {
      err.stack = new Error(err.message).stack

      err.body = JSON.stringify({
        keys,
        key,
        endkey,
        startkey,
      })
      throw err
    })

  return response
}
