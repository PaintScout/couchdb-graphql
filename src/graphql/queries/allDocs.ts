import { gql } from 'apollo-server-core'
import axios from 'axios'
import queryString from 'query-string'
import createResolver from '../../util/createResolver'

export const typeDefs = gql`
  type AllDocsRow {
    id: String!
    rev: String
    value: JSON
    doc: JSON
  }

  type AllDocsResponse {
    total_rows: Int!
    offset: Int!
    rows: [AllDocsRow!]!
  }

  extend type Query {
    allDocs(
      conflicts: Boolean
      endkey: JSON
      include_docs: Boolean
      inclusive_end: Boolean
      key: JSON
      keys: [JSON!]
      limit: Int
      skip: Int
      startkey: JSON
      update_seq: Boolean
    ): AllDocsResponse
  }
`

export const resolvers = createResolver({
  Query: {
    allDocs: async (parent, { keys, ...args }, context, info) => {
      let url = `${context.dbUrl}/${context.dbName}/_all_docs`

      if (args) {
        url += `?${queryString.stringify(args)}`
      }

      const response = await axios.post(url, { keys })

      return response.data
    },
  },
})
