import queryString from 'qs'
import { CouchDbDocument } from '../types'
import { CouchDbContext } from '../createContext'
import parseFetchResponse from '../util/parseFetchResponse'

export interface GetOptions {
  rev?: string
  revs?: boolean
  revs_info?: boolean
  open_revs?: boolean
  conflicts?: boolean
  attachments?: boolean
  latest?: boolean
}

export async function get<T extends CouchDbDocument>(
  context: CouchDbContext,
  id: string,
  options: GetOptions = {}
): Promise<T> {
  const { fetch, dbUrl, dbName } = context.couchDb
  const hasArgs = Object.keys(options).length > 0

  if (!id) {
    throw new Error('id is undefined')
  }

  let url = `${dbUrl}/${dbName}/${encodeURIComponent(id)}`

  if (hasArgs) {
    url += `?${queryString.stringify(options)}`
  }

  const response = await fetch(url)
    .then(parseFetchResponse)
    .catch((err) => {
      err._id = id
      err.stack = new Error(err.message).stack + (err.stack ?? '')

      throw err
    })

  return response
}
