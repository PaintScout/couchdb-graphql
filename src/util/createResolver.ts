import { GraphQLResolverMap } from '@apollographql/apollo-tools'
import { CouchDbContext } from '..'

export default function createResolver(
  resolver: GraphQLResolverMap<CouchDbContext>
) {
  return resolver
}
