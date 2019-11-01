import { CouchDbContext } from './createResolver'
import getAxios from './getAxios'

/**
 * Resolves conflicts by calling context.onResolveConflict and saving its result
 */
export default async function resolveConflicts(
  documents: any[],
  context: CouchDbContext
) {
  const conflictingDocuments = await getConflictsByDocument(documents, context)

  const resolvedDocs = await Promise.all(
    Object.keys(conflictingDocuments).map(async id => {
      const { _conflicts, ...resolved } = await context.onResolveConflict({
        document: conflictingDocuments[id].document,
        conflicts: conflictingDocuments[id].conflicts,
        context,
      })

      return {
        ...resolved,
        _rev: conflictingDocuments[id].revToSave,
      }
    })
  )

  const docsToSave = [
    ...resolvedDocs,

    ...Object.keys(conflictingDocuments).reduce(
      (deleted, docId) => [
        ...deleted,
        ...conflictingDocuments[docId].conflicts
          .map(conflict => ({
            ...conflict,
            _deleted: true,
          }))
          .filter(
            conflict => conflict._rev !== conflictingDocuments[docId].revToSave
          ),
      ],
      [] as any[]
    ),
  ]

  const response = await getAxios(context).post(
    `${context.dbUrl}/${context.dbName}/_bulk_docs`,
    {
      docs: docsToSave,
    }
  )

  return response.data
}

/**
 * Returns an object where the key is the doc id and the value is the rejected document
 * and full conflicting documents
 */
async function getConflictsByDocument(
  documents: any[],
  context: CouchDbContext
): Promise<
  Record<string, { document: any; conflicts: any[]; revToSave: string }>
> {
  // get _conflicts for each document
  const documentsWithConflictRevs = await getAxios(context)
    .post(
      `${context.dbUrl}/${context.dbName}/_all_docs?conflicts=true&include_docs=true`,
      {
        keys: documents.map(doc => doc._id),
      }
    )
    .then(res => res.data.rows.map(row => row.doc))

  // get full document for each _conflict
  const conflictingDocuments = await getAxios(context)
    .post(`${context.dbUrl}/${context.dbName}/_bulk_get`, {
      docs: documentsWithConflictRevs.reduce(
        (conflicts, doc) => [
          ...conflicts,
          ...(doc._conflicts || []).map(rev => ({
            id: doc._id,
            rev,
          })),
        ],
        []
      ),
    })
    .then(res =>
      res.data.results.map(row => row.docs[0].ok).filter(doc => !!doc)
    )

  return documentsWithConflictRevs.reduce((result, doc) => {
    if (!result[doc._id]) {
      const conflictedDoc = documentsWithConflictRevs.find(
        d => d._id === doc._id
      )

      result[doc._id] = {
        // the document rejected by the conflict
        document: documents.find(original => original._id === doc._id),
        // all conflicts in the db including the one with _conflicts
        conflicts: [doc],
        revToSave: conflictedDoc._rev,
      }
    }

    // check if any _conflicts were for this document
    const conflicts = conflictingDocuments.filter(d => d._id === doc._id)

    if (conflicts) {
      return {
        ...result,
        [doc._id]: {
          ...result[doc._id],
          conflicts: [...result[doc._id].conflicts, ...conflicts],
        },
      }
    }

    return result
  }, {})
}
