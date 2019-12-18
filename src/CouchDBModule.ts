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
>
  extends Omit<
    GraphQLModuleOptions<Config, Session, Context, SelfResolvers>,
    'typeDefs' | 'resolvers'
  > {
  cloudant?: boolean
}

export class CouchDBModule<
  Config = any,
  Session extends object = any,
  Context = CouchDbContext,
  SelfResolvers extends Resolvers<any, ModuleContext<Context>> = Resolvers<
    any,
    ModuleContext<Context>
  >
> extends GraphQLModule {
  constructor(
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

    // combine Query resolvers
    const queryResolvers = Object.keys(
      cloudant ? queries : couchdbQueries
    ).reduce(
      (resolvers, key) => ({
        ...resolvers,
        ...queries[key].resolvers.Query,
      }),
      {}
    )

    // combine Mutation resolvers
    const mutationResolvers = Object.keys(mutations).reduce(
      (resolvers, key) => ({
        ...resolvers,
        ...mutations[key].resolvers.Mutation,
      }),
      {}
    )

    // pass args into GraphQLModule
    super(
      {
        ...options,
        typeDefs,
        resolvers: {
          Query: queryResolvers,
          Mutation: mutationResolvers,
        },
      },
      moduleConfig
    )
  }
}
