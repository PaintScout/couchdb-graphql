import { gql } from 'apollo-server-core'
import axios from 'axios'
import queryString from 'qs'
import createResolver from '../../util/createResolver'

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

export const resolvers = createResolver({
  Query: {
    get: async (parent, { id, ...args }, context, info) => {
      const hasArgs = Object.keys(args).length > 0
      let url = `${context.dbUrl}/${context.dbName}/${encodeURIComponent(id)}`

      if (hasArgs) {
        url += `?${queryString.stringify(args)}`
      }

      const response = await axios.get(url)

      return {
        _id: response.data._id,
        _rev: response.data._rev,
        document: response.data,
      }
    },
  },
})
