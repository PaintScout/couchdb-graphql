import { resolveConflicts } from '../util/resolveConflicts'
import { CouchDbDocument } from '../util/createResolver'
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
  let rev = doc._rev

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
      const [result] = res

      // resolve conflicts
      if (result && result.id && result.error === 'conflict') {
        const resolved = await resolveConflicts([doc], context)

        return resolved[0]
      }

      return result
    })

  if (result && result.error) {
    throw new Error(result.reason)
  }

  if (result) {
    const savedDocument = {
      ...doc,
      _id: result.id,
      _rev: result.rev,
    }

    if (onDocumentsSaved) {
      onDocumentsSaved({ documents: [savedDocument], context })
    }

    return savedDocument
  } else {
    // new_edits=false returns empty response
    return null
  }
}
