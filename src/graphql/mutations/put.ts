import { gql } from 'apollo-server-core'
import { createResolver } from '../../util/createResolver'
import { put } from '../../couchdb/put'

/**
 * PUTs a document using _bulk_docs endpoint
 */
export const typeDefs = gql`
  type PutResponse {
    _id: String!
    _rev: String
    document: JSON
  }

  extend type Mutation {
    put(input: JSON, upsert: Boolean, new_edits: Boolean): PutResponse
  }
`

export const resolvers = {
  Mutation: {
    put: createResolver(
      async (parent, { input, upsert, new_edits = true }, context, info) => {
        const document = await put(context, input, { upsert, new_edits })

        return {
          _id: document._id,
          _rev: document._rev,
          document,
        }
      }
    ),
  },
}
