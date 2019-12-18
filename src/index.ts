import { base } from './graphql/base'
import * as mutations from './graphql/mutations'
import * as queries from './graphql/queries'

export * from './couchdb'

export * from './createCouchDbModule'
export * from './createContext'
export * from './util/resolveConflicts'
export * from './util/createResolver'
export * from './types'

export { queries, mutations, base }
