import { base } from './graphql/base'
import * as mutations from './graphql/mutations'
import * as queries from './graphql/queries'

export * from './createSchema'

export * from './util/resolveConflicts'
export * from './util/createResolver'

export { queries, mutations, base }
