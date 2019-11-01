import { GraphQLResolverMap } from '@apollographql/apollo-tools'

interface CouchDbDocument {
  _id: string
  _rev?: string
}

export interface CouchDbContext {
  dbUrl: string
  dbName: string
  onResolveConflict: <T extends CouchDbDocument>(args: {
    document: T
    conflicts: T[]
    context: CouchDbContext
  }) => T
}

export default function createResolver(
  resolver: GraphQLResolverMap<CouchDbContext>
) {
  return resolver
}
