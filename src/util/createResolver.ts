import { GraphQLResolverMap } from '@apollographql/apollo-tools'

export interface CouchDbDocument {
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
  onConflictsResolved?: <T extends CouchDbDocument>(args: {
    documents: T[]
    context: CouchDbContext
  }) => any
  onDocumentsSaved?: <T extends CouchDbDocument>(args: {
    documents: T[]
    context: CouchDbContext
  }) => any
}

export function createResolver(resolver: GraphQLResolverMap<CouchDbContext>) {
  return resolver
}
