import { CouchDbDocument } from '../types'
import { CouchDbContext } from '../createContext'
import parseFetchResponse from '../util/parseFetchResponse'

export async function createDb<T extends CouchDbDocument>(
  context: CouchDbContext
): Promise<T> {
  const { fetch, dbUrl, dbName } = context.couchDb
  let url = `${dbUrl}/${dbName}`

  const response = await fetch(url, { method: 'PUT' })
    .then(parseFetchResponse)
    .catch((err) => {
      err.stack = new Error(err.message).stack + (err.stack ?? '')

      throw err
    })

  return response
}
