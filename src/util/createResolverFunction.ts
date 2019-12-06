import { CouchDbContext } from '../createContext'
import { GraphQLFieldResolver } from 'graphql'

export function createResolverFunction<T = any>(
  resolver: GraphQLFieldResolver<any, CouchDbContext, T>
) {
  return resolver
}
