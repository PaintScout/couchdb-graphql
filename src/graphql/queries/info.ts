import { gql } from 'apollo-server-core'
import getAxios from '../../util/getAxios'
import createResolver from '../../util/createResolver'

/**
 * Generic GET on a document
 */
export const typeDefs = gql`
  type Sizes {
    file: Int
    external: Int
    active: Int
  }

  type Other {
    data_size: Int
  }

  type Cluster {
    q: Int
    n: Int
    w: Int
    r: Int
  }

  type InfoResponse {
    db_name: String
    update_seq: String
    sizes: Sizes
    purge_seq: Int
    other: Other
    doc_del_count: Int
    doc_count: Int
    disk_size: Int
    disk_format_version: Int
    data_size: Int
    compact_running: Boolean
    cluster: Cluster
    instance_start_time: Int
  }

  extend type Query {
    info: InfoResponse
  }
`

export const resolvers = createResolver({
  Query: {
    info: async (parent, args, context, info) => {
      let url = `${context.dbUrl}`

      const response = await getAxios(context).get(url)

      return response.data
    },
  },
})
