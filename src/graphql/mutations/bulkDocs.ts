import { gql } from 'apollo-server-core'
import axios from 'axios'

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
    bulkDocs: async (parent, { input, upsert, new_edits }, context, info) => {
      let url = `${context.dbUrl}/${context.dbName}/_bulk_docs`
      let previousRevs: Record<string, string> = {}

      // get previous _revs for upsert
      if (upsert) {
        const ids: string[] = input.map(i => i._id).filter(id => !!id)

        const { data: allDocs } = await axios.post(
          `${context.dbUrl}/${context.dbName}/_all_docs`,
          {
            keys: ids,
          }
        )

        allDocs.rows.forEach(row => {
          previousRevs[row.id] = row.value.rev
        })
      }

      const response = await axios.post(url, {
        docs: input.map(i => ({
          ...i,
          _rev: upsert && i._id ? previousRevs[i._id] : i._rev,
        })),
        new_edits,
      })

      const results = response.data

      return results.map((result, index) => {
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
