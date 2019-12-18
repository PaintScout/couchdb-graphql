import {
  GraphQLModule,
  GraphQLModuleOptions,
  Resolvers,
  ModuleContext,
} from '@graphql-modules/core'
import { CouchDbContext } from './createContext'
import * as mutations from './graphql/mutations'
import * as queries from './graphql/queries'
import { base } from './graphql/base'

export interface CouchDBModuleOptions<
  Config = any,
  Session extends object = any,
  Context = CouchDbContext,
  SelfResolvers extends Resolvers<any, ModuleContext<Context>> = Resolvers<
    any,
    ModuleContext<Context>
  >
> extends GraphQLModuleOptions<Config, Session, Context, SelfResolvers> {
  cloudant?: boolean
}

export function createCouchDbModule<
  Config = any,
  Session extends object = any,
  Context = CouchDbContext,
  SelfResolvers extends Resolvers<any, ModuleContext<Context>> = Resolvers<
    any,
    ModuleContext<Context>
  >
>(
  {
    cloudant,
    ...options
  }: CouchDBModuleOptions<Config, Session, Context, SelfResolvers>,
  moduleConfig?: Config
) {
  // separate cloudant queries from couchdb
  const { search, ...couchdbQueries } = queries

  // combine typeDefs
  const typeDefs = [
    base.typeDefs,
    ...Object.keys(cloudant ? queries : couchdbQueries).map(
      key => queries[key].typeDefs
    ),
    ...Object.keys(mutations).map(key => mutations[key].typeDefs),
  ]

  if (options.typeDefs) {
    if (Array.isArray(options.typeDefs)) {
      typeDefs.push(...options.typeDefs)
    } else {
      typeDefs.push(options.typeDefs)
    }
  }

  // combine resolvers
  const resolvers = [
    ...Object.keys(cloudant ? queries : couchdbQueries).map(
      key => queries[key].resolvers
    ),
    ...Object.keys(mutations).map(key => mutations[key].resolvers),
  ]

  if (options.resolvers) {
    if (Array.isArray(options.resolvers)) {
      typeDefs.push(...options.resolvers)
    } else {
      typeDefs.push(options.resolvers)
    }
  }

  return new GraphQLModule(
    {
      ...options,
      typeDefs,
      resolvers,
    },
    moduleConfig
  )
}
