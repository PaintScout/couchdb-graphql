import { gql } from 'apollo-server-core'
import { createResolverFunction } from '../../util/createResolverFunction'
import { search, SearchOptions } from '../../couchdb/search'

export const typeDefs = gql`
  type SearchResponse {
    total_rows: Int!
    bookmark: String!
    rows: [SearchRow]!
    counts: JSON
  }

  type SearchRow {
    id: String!
    order: [Int!]!
    fields: JSON!
    doc: JSON
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

export const resolvers = {
  Query: {
    search: createResolverFunction<SearchOptions>(
      async (parent, args, context, info) => {
        return search(context, args)
      }
    ),
  },
}
