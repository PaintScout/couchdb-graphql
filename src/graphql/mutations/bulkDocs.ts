import { gql } from 'apollo-server-core'
import getAxios from '../../util/getAxios'
import { resolveConflicts } from '../../util/resolveConflicts'

export const typeDefs = gql`
  type BulkDocsResponseObject {
    _id: String
    _rev: String
    document: JSON
    error: String
    reason: String
  }

  extend type Mutation {
    bulkDocs(
      input: [JSON!]!
      upsert: Boolean
      new_edits: Boolean
    ): [BulkDocsResponseObject]
  }
`

export const resolvers = {
  Mutation: {
    bulkDocs: async (
      parent,
      { input, upsert, new_edits = true },
      context,
      info
    ) => {
      let url = `${context.dbUrl}/${context.dbName}/_bulk_docs`
      let previousRevs: Record<string, string> = {}

      // get previous _revs for upsert
      if (upsert) {
        const ids: string[] = input.map(i => i._id).filter(id => !!id)

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

      const response = await getAxios(context).post(url, {
        docs: input.map(doc => ({
          ...doc,
          _rev: upsert && doc._id ? previousRevs[doc._id] : doc._rev,
        })),
        new_edits,
      })

      let saveResults = response.data
      const conflicts = response.data.filter(
        result => result.error === 'conflict'
      )

      if (conflicts.length > 0) {
        const resolved = await resolveConflicts(
          input.filter(doc =>
            conflicts.find(conflict => conflict.id === doc._id)
          ),
          context
        )

        // update any "conflict" results with the resolved result
        saveResults = saveResults.map(saveResult => {
          const resolvedDoc = resolved.find(
            resolvedResult => resolvedResult.id === saveResult.id
          )
          if (saveResult.error === 'conflict' && resolvedDoc) {
            return resolvedDoc
          }

          return saveResult
        })
      }

      return saveResults.map((result, index) => {
        const document = input[index]

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
    },
  },
}
