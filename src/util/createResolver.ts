import { CouchDbContext } from '../createContext'
import { GraphQLFieldResolver } from 'graphql'

export function createResolver<T = any>(
  resolver: GraphQLFieldResolver<any, CouchDbContext, T>
) {
  return resolver
}
