import { gql } from 'apollo-server-core'
import { createResolver } from '../../util/createResolver'
import { get } from '../../couchdb'

/**
 * Generic GET on a document
 */
export const typeDefs = gql`
  type GetResponse {
    _id: String!
    _rev: String
    document: JSON
  }

  extend type Query {
    get(
      id: String!
      rev: String
      revs: Boolean
      revs_info: Boolean
      open_revs: Boolean
      conflicts: Boolean
      attachments: Boolean
      latest: Boolean
    ): GetResponse
  }
`

export const resolvers = {
  Query: {
    get: createResolver(async (parent, { id, ...args }, context, info) => {
      const document = await get(context, id, args)
      return {
        _id: document._id,
        _rev: document._rev,
        document,
      }
    }),
  },
}
