import { gql } from 'apollo-server-core'
import getAxios from '../../util/getAxios'
import queryString from 'qs'
import createResolver from '../../util/createResolver'

export const typeDefs = gql`
  type SearchResponse {
    total_rows: Int
    bookmark: String
    rows: [SearchRow]
    counts: JSON
  }

  type SearchRow {
    id: String
    order: [Int]
    fields: JSON
  }

  extend type Query {
    search(
      index: String!
      ddoc: String!
      bookmark: String
      counts: [String!]
      drilldown: JSON
      group_field: String
      group_limit: Int
      group_sort: JSON
      highlight_fields: [String!]
      highlight_pre_tag: String
      highlight_post_tag: String
      highlight_number: Int
      highlight_size: Int
      include_docs: Boolean
      include_fields: [String!]
      limit: Int
      query: String!
      ranges: JSON
      sort: [String!]
      stale: String
    ): SearchResponse
  }
`

export const resolvers = createResolver({
  Query: {
    search: async (
      parent,
      { index, ddoc, typename, ...args },
      context,
      info
    ) => {
      let url = `${context.dbUrl}/${context.dbName}/_design/${ddoc}/_search/${index}`

      const response = await getAxios(context).post(url, args)

      return response.data
    },
  },
})
