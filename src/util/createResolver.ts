import { GraphQLResolverMap } from '@apollographql/apollo-tools'
import { CouchDbContext } from '../createContext'

export function createResolver(resolver: GraphQLResolverMap<CouchDbContext>) {
  return resolver
}
