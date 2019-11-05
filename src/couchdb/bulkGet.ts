import getAxios from '../util/getAxios'
import queryString from 'qs'
import { CouchDbContext, CouchDbDocument } from '../util/createResolver'

export interface BulkGetOptions {
  revs?: boolean
}

export interface BulkGetResponse {
  results: Array<{
    ok?: CouchDbDocument
    error?: {
      id: string
      rev?: string
      error: string
      reason: string
    }
  }>
}

export async function bulkGet(
  docs: Array<{ id: string; rev: string }>,
  context: CouchDbContext,
  { revs }: BulkGetOptions
): Promise<BulkGetResponse> {
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
