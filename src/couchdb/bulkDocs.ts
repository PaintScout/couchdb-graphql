import getAxios from '../util/getAxios'
import { resolveConflicts } from '../util/resolveConflicts'
import { CouchDbDocument, CouchDbContext } from '../util/createResolver'

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
  docs: CouchDbDocument[],
  options: BulkDocsOptions = {}
): Promise<BulkDocsResponse<T>> {
  const { upsert, new_edits = true } = options
  let url = `${context.dbUrl}/${context.dbName}/_bulk_docs`
  let previousRevs: Record<string, string> = {}

  // get previous _revs for upsert
  if (upsert) {
    const ids: string[] = docs.map(i => i._id).filter(id => !!id)

    const { data: allDocs } = await getAxios(context).post(
      `${context.dbUrl}/${context.dbName}/_all_docs`,
      {
        keys: ids,
      }
    )

    allDocs.rows.forEach(row => {
      previousRevs[row.id] = row.value ? row.value.rev : null
    })
  }

  const saveResults = await getAxios(context)
    .post(url, {
      docs: docs.map(doc => ({
        ...doc,
        _rev: upsert && doc._id ? previousRevs[doc._id] : doc._rev,
      })),
      new_edits,
    })
    .then(async res => {
      // resolve conflicts
      const conflicts = res.data.filter(result => result.error === 'conflict')

      if (conflicts.length > 0) {
        const resolved = await resolveConflicts(
          docs.filter(doc =>
            conflicts.find(conflict => conflict.id === doc._id)
          ),
          context
        )

        if (resolved) {
          // update any "conflict" results with the resolved result
          return res.data.map(saveResult => {
            const resolvedDoc = resolved.find(
              resolvedResult => resolvedResult.id === saveResult.id
            )
            if (saveResult.error === 'conflict' && resolvedDoc) {
              return resolvedDoc
            }

            return saveResult
          })
        }
      }

      // return bulkDocs data
      return res.data
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

  if (context.onDocumentsSaved) {
    context.onDocumentsSaved({
      documents: response.filter(res => !res.error).map(res => res.document),
      context,
    })
  }

  return response
}
