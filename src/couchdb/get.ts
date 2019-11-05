import { gql } from 'apollo-server-core'
import getAxios from '../util/getAxios'
import queryString from 'qs'
import { CouchDbContext, CouchDbDocument } from '../util/createResolver'

export interface GetOptions {
  rev?: string
  revs?: boolean
  revs_info?: boolean
  open_revs?: boolean
  conflicts?: boolean
  attachments?: boolean
  latest?: boolean
}

export async function get(
  context: CouchDbContext,
  id: string,
  options: GetOptions = {}
): Promise<CouchDbDocument> {
  const hasArgs = Object.keys(options).length > 0
  let url = `${context.dbUrl}/${context.dbName}/${encodeURIComponent(id)}`

  if (hasArgs) {
    url += `?${queryString.stringify(options)}`
  }

  const response = await getAxios(context).get(url)

  return response.data
}
