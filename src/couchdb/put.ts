import getAxios from '../util/getAxios'
import { resolveConflicts } from '../util/resolveConflicts'
import { CouchDbContext, CouchDbDocument } from '../util/createResolver'

interface PutOptions {
  upsert?: boolean
  new_edits?: boolean
}

export async function put<T extends CouchDbDocument>(
  context: CouchDbContext,
  doc: T,
  options: PutOptions = {}
): Promise<T | null> {
  const { upsert, new_edits = true } = options
  let url = `${context.dbUrl}/${context.dbName}/_bulk_docs`
  let rev = doc._rev

  // get previous _rev for upsert
  if (upsert) {
    if (!doc._id) {
      throw Error('upsert option requires input to contain _id')
    }

    try {
      const {
        data: { _rev },
      } = await getAxios(context).get(
        `${context.dbUrl}/${context.dbName}/${encodeURIComponent(doc._id)}`
      )
      rev = _rev
    } catch (e) {
      if (!e.response || e.response.status !== 404) {
        throw e
      }
    }
  }

  const result = await getAxios(context)
    .post(url, {
      docs: [{ ...doc, _rev: rev }],
      new_edits,
    })
    .then(async res => {
      const [result] = res.data

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

    if (context.onDocumentsSaved) {
      context.onDocumentsSaved([savedDocument])
    }

    return savedDocument
  } else {
    // new_edits=false returns empty response
    return null
  }
}
