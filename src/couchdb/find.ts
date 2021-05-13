import parseFetchResponse from '../util/parseFetchResponse'
import { CouchDbContext } from '../createContext'

export interface FindOptions {
  selector?: any
  limit?: number
  skip?: number
  sort?: number
  fields?: string[]
  use_index?: string[]
  r?: number
  bookmark?: string
  update?: boolean
  stable?: boolean
  stale?: string
  execution_stats?: boolean
}

export interface FindResponse<T = any> {
  execution_stats: any
  bookmark: any
  warning: string
  docs: T[]
}

export async function find<T = any>(
  context: CouchDbContext,
  options: FindOptions
): Promise<FindResponse<T>> {
  const { fetch, dbUrl, dbName } = context.couchDb
  let url = `${dbUrl}/${dbName}/_find`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  })
    .then(parseFetchResponse)
    .catch(err => {
      err.stack = new Error(err.message).stack + (err.stack ?? '')
      err.body = JSON.stringify(options)
      throw err
    })

  return response
}
