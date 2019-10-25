import { GraphQLResolverMap } from '@apollographql/apollo-tools'

export default function createResolver(
  resolver: GraphQLResolverMap<{ dbName: string; dbUrl: string }>
) {
  return resolver
}
