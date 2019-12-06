import queryString from 'qs'
import { CouchDbDocument } from '../types'
import { CouchDbContext } from '../createContext'
import parseFetchResponse from '../util/parseFetchResponse'

export interface BulkGetOptions {
  revs?: boolean
}

export interface BulkGetResponse<T extends CouchDbDocument> {
  results: Array<{
    ok?: T
    error?: {
      id: string
      rev?: string
      error: string
      reason: string
    }
  }>
}

export async function bulkGet<T extends CouchDbDocument>(
  docs: Array<{ id: string; rev?: string }>,
  context: CouchDbContext,
  { revs }: BulkGetOptions = {}
): Promise<BulkGetResponse<T>> {
  const { fetch, dbUrl, dbName } = context.couchDb
  let url = `${dbUrl}/${dbName}/_bulk_get`

  if (revs) {
    url += `?${queryString.stringify({ revs })}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      docs,
      revs,
    }),
  }).then(parseFetchResponse)

  return response
}
