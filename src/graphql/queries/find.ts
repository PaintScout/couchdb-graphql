import { gql } from 'apollo-server-core'
import { createResolver } from '../../util/createResolver'
import { find } from '../../couchdb'

export const typeDefs = gql`
  type FindResponse {
    execution_stats: JSON
    bookmark: String
    warning: String
    docs: [JSON!]
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

export const resolvers = {
  Query: {
    find: createResolver((parent, args, context, info) => {
      return find(context, args)
    }),
  },
}
