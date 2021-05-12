import { resolveConflicts } from '../util/resolveConflicts'
import { CouchDbDocument } from '../types'
import { CouchDbContext } from '../createContext'
import parseFetchResponse from '../util/parseFetchResponse'

interface PutOptions {
  upsert?: boolean
  new_edits?: boolean
}

export async function put<T extends CouchDbDocument>(
  context: CouchDbContext,
  doc: T,
  options: PutOptions = {}
): Promise<T | null> {
  const { fetch, dbUrl, dbName, onDocumentsSaved } = context.couchDb

  const { upsert, new_edits = true } = options
  let url = `${dbUrl}/${dbName}/_bulk_docs`
  let rev = doc._rev ?? undefined // don't let it be null

  // couchdb errors if _deleted is null
  if (doc._deleted === null) {
    delete doc._deleted
  }

  // get previous _rev for upsert
  if (upsert) {
    if (!doc._id) {
      throw Error('upsert option requires input to contain _id')
    }

    try {
      const { _rev } = await fetch(
        `${dbUrl}/${dbName}/${encodeURIComponent(doc._id)}`
      ).then(parseFetchResponse)
      rev = _rev
    } catch (e) {
      e._id = doc._id
      if (!e.response || e.response.status !== 404) {
        throw e
      }
    }
  }

  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      docs: [{ ...doc, _rev: rev }],
      new_edits,
    }),
  })
    .then(parseFetchResponse)
    .then(async res => {
      const result = Array.isArray(res) ? res[0] : res

      // resolve conflicts
      if (result && result.id && result.error === 'conflict') {
        const [resolved] = await resolveConflicts([doc], context)

        if (resolved) {
          return resolved
        }
      }

      throw new Error('blasdkjhf')
    })
    .catch(err => {
      err.stack = new Error(err.message).stack
      err._id = doc._id

      throw err
    })

  if (result && result.error) {
    const err = new Error(result.reason)
    // @ts-ignore
    err._id = doc._id

    throw err
  }

  if (result) {
    if (onDocumentsSaved) {
      onDocumentsSaved({ documents: [result], context })
    }

    return result
  } else {
    // new_edits=false returns empty response
    return null
  }
}
