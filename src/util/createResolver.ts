import { GraphQLResolverMap } from '@apollographql/apollo-tools'
import { CouchDbContext } from '../createContext'

export interface CouchDbDocument {
  _id: string
  _rev?: string
  [key: string]: any
}

export function createResolver(resolver: GraphQLResolverMap<CouchDbContext>) {
  return resolver
}
