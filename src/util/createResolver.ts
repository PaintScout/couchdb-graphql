import { GraphQLResolverMap } from '@apollographql/apollo-tools'

interface CouchDbDocument {
  _id: string
  _rev?: string
  [key: string]: any
}

export interface CouchDbContext {
  dbUrl: string
  dbName: string
  onResolveConflict?: <T extends CouchDbDocument>(args: {
    document: T
    conflicts: T[]
    context: CouchDbContext
  }) => T
  onConflictsResolved?: <T extends CouchDbDocument>(documents: T[]) => any
  onDocumentsSaved?: <T extends CouchDbDocument>(documents: T[]) => any
}

export function createResolver(resolver: GraphQLResolverMap<CouchDbContext>) {
  return resolver
}
