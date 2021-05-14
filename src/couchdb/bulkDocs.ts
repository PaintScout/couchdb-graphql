import { resolveConflicts } from '../util/resolveConflicts'
import { CouchDbDocument } from '../types'
import { CouchDbContext } from '../createContext'
import parseFetchResponse from '../util/parseFetchResponse'

export interface BulkDocsResponseObject<T extends CouchDbDocument> {
  _id: string
  _rev?: string
  document?: T
  error?: string
  reason?: string
}

export type BulkDocsResponse<
  T extends CouchDbDocument
> = BulkDocsResponseObject<T>[]

export interface BulkDocsOptions {
  upsert?: boolean
  new_edits?: boolean
}
export async function bulkDocs<T extends CouchDbDocument>(
  context: CouchDbContext,
  docs: any[],
  options: BulkDocsOptions = {}
): Promise<BulkDocsResponse<T>> {
  const { fetch, dbUrl, dbName, onDocumentsSaved } = context.couchDb
  const { upsert, new_edits = true } = options
  let url = `${dbUrl}/${dbName}/_bulk_docs`
  let previousRevs: Record<string, string> = {}

  // get previous _revs for upsert
  if (upsert) {
    const ids: string[] = docs.map((i) => i._id).filter((id) => !!id)

    const { data: allDocs } = await fetch(`${dbUrl}/${dbName}/_all_docs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keys: ids,
      }),
    }).then(parseFetchResponse)

    allDocs.rows.forEach((row) => {
      previousRevs[row.id] = row.value ? row.value.rev : null
    })
  }

  const saveResults = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      docs: docs.map((doc) => {
        const docToSave = {
          ...doc,
          _rev:
            // fallback to undefined if it is null
            (upsert && doc._id ? previousRevs[doc._id] : doc._rev) ?? undefined,
        }

        if (docToSave._deleted === null) {
          delete docToSave._deleted
        }

        return docToSave
      }),
      new_edits,
    }),
  })
    .then(parseFetchResponse)
    .then(async (res) => {
      // resolve conflicts
      const conflicts = res.filter((result) => result.error === 'conflict')

      if (conflicts.length > 0) {
        const resolved = await resolveConflicts(
          docs.filter((doc) =>
            conflicts.find((conflict) => conflict.id === doc._id)
          ),
          context
        )

        if (resolved) {
          // update any "conflict" results with the resolved result
          return res.map((saveResult) => {
            const resolvedDoc = resolved.find(
              (resolvedResult) => resolvedResult.id === saveResult.id
            )
            if (saveResult.error === 'conflict' && resolvedDoc) {
              return resolvedDoc
            }

            return saveResult
          })
        }
      }

      // return bulkDocs data
      return res
    })
    .catch((err) => {
      err.stack = new Error(err.message).stack + (err.stack ?? '')
      err.ids = docs.map((d) => d._id)

      throw err
    })

  const response = saveResults.map((result, index) => {
    const document = docs[index]

    const _rev = result.error
      ? // if an error, return the last _rev
        previousRevs[document._id] || document._rev
      : // otherwise result.rev will be populated
        result.rev

    return {
      _id: result.id,
      _rev,
      error: result.error,
      reason: result.reason,
      document: {
        ...document,
        _id: result.id,
        _rev,
      },
    }
  })

  if (onDocumentsSaved) {
    onDocumentsSaved({
      documents: response
        .filter((res) => !res.error)
        .map((res) => res.document),
      context,
    })
  }

  return response
}
