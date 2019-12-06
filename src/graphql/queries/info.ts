import { gql } from 'apollo-server-core'
import { createResolverFunction } from '../../util/createResolverFunction'
import { info } from '../../couchdb/info'

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

export const resolvers = {
  Query: {
    info: createResolverFunction((parent, args, context) => {
      return info(context)
    }),
  },
}
