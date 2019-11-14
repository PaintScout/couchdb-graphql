import getAxios from '../util/getAxios'
import queryString from 'qs'
import { CouchDbContext, CouchDbDocument } from '../util/createResolver'

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
  docs: Array<{ id: string; rev: string }>,
  context: CouchDbContext,
  { revs }: BulkGetOptions
): Promise<BulkGetResponse<T>> {
  let url = `${context.dbUrl}/${context.dbName}/_bulk_get`

  if (revs) {
    url += `?${queryString.stringify({ revs })}`
  }

  const response = await getAxios(context).post(url, {
    docs,
    revs,
  })

  return response.data
}
