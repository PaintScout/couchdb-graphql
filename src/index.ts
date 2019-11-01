import { base } from './graphql/base'
import * as mutations from './graphql/mutations'
import * as queries from './graphql/queries'
export * from './createSchema'
export { queries, mutations, base }

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
