import { gql } from 'apollo-server-core'
import getAxios from '../../util/getAxios'
import { createResolver } from '../../util/createResolver'

export const typeDefs = gql`
  type FindResponse {
    execution_stats: JSON
    bookmark: String
    warning: String
    docs: [JSON!]
  }

  type FindRow {
    id: String
    order: [Int!]
    fields: JSON
  }

  extend type Query {
    find(
      selector: JSON!
      limit: Int
      skip: Int
      sort: Int
      fields: [String!]
      use_index: [String!]
      r: Int
      bookmark: String
      update: Boolean
      stable: Boolean
      stale: String
      execution_stats: Boolean
    ): FindResponse
  }
`

export const resolvers = createResolver({
  Query: {
    find: async (parent, { index, ddoc, ...args }, context, info) => {
      let url = `${context.dbUrl}/${context.dbName}/_find`

      const response = await getAxios(context).post(url, args)

      return response.data
    },
  },
})
