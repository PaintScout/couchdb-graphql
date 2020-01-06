import { CouchDbContext } from '../createContext'
import parseFetchResponse from './parseFetchResponse'

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
  const { fetch, dbUrl, dbName } = context.couchDb

  // get _conflicts for each document
  const documentsWithConflictRevs = await fetch(
    `${dbUrl}/${dbName}/_all_docs?conflicts=true&include_docs=true`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keys: documents.map(doc => doc._id),
      }),
    }
  )
    .then(parseFetchResponse)
    .then(res => {
      return res.rows.map(row => row.doc).filter(doc => !!doc)
    })

  // get full document for each _conflict
  const conflictingDocuments = await fetch(`${dbUrl}/${dbName}/_bulk_get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      docs: documentsWithConflictRevs.reduce(
        (conflicts, doc) => [
          ...conflicts,
          ...((doc && doc._conflicts) || []).map(rev => ({
            id: doc._id,
            rev,
          })),
        ],
        []
      ),
    }),
  })
    .then(parseFetchResponse)
    .then(res => res.results.map(row => row.docs[0].ok).filter(doc => !!doc))

  const result = documentsWithConflictRevs.reduce((result, doc) => {
    if (!result[doc._id]) {
      const conflictedDoc = documentsWithConflictRevs.find(
        d => d._id === doc._id
      )

      result[doc._id] = {
        // the document rejected by the conflict
        document: documents.find(original => original._id === doc._id),
        // add the stored document in the conflicts array
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

  return result
}

/**
 * Resolves conflicts by calling context.onResolveConflict and saving its result
 */
export async function resolveConflicts(
  documents: any[],
  context: CouchDbContext
) {
  const {
    fetch,
    dbName,
    dbUrl,
    onResolveConflict,
    onConflictsResolved,
  } = context.couchDb
  if (!onResolveConflict) {
    return null
  }

  const conflictingDocuments = await getConflictsByDocument(documents, context)

  const resolvedDocs = await Promise.all(
    Object.keys(conflictingDocuments).map(async id => {
      const resolvedDocument = await onResolveConflict!({
        document: conflictingDocuments[id].document,
        conflicts: conflictingDocuments[id].conflicts,
        context,
      })

      if (resolvedDocument) {
        const { _conflicts, ...resolved } = resolvedDocument
        return {
          ...resolved,
          _rev: conflictingDocuments[id].revToSave,
        }
      }
    })
  ).then(res => res.filter(x => !!x))

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

  const response = await fetch(`${dbUrl}/${dbName}/_bulk_docs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      docs: docsToSave,
    }),
  }).then(parseFetchResponse)

  const resolvedDocuments = response
    .filter(result => result.ok)
    .map(result => ({
      ...docsToSave.find(doc => doc._id === result.id),
      _rev: result.rev,
      _id: result.id,
    }))

  if (onConflictsResolved && resolvedDocuments.length > 0) {
    onConflictsResolved({
      documents: resolvedDocuments,
      context,
    })
  }
  return response
}
