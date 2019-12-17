import { GraphQLModule, GraphQLModuleOptions } from '@graphql-modules/core'
import { CouchDbContext } from './createContext'
import * as mutations from './graphql/mutations'
import * as queries from './graphql/queries'
import { base } from './graphql/base'

export interface CreateCouchDbModuleArgs<
  Config,
  Session extends object,
  Context extends CouchDbContext = CouchDbContext,
  SelfResolvers = {}
>
  extends Omit<
    GraphQLModuleOptions<Config, Session, Context, SelfResolvers>,
    'typeDefs' | 'resolvers'
  > {
  cloudant?: boolean
}

export function createCouchDbModule<
  Config,
  Session extends object,
  Context extends CouchDbContext = CouchDbContext,
  SelfResolvers = {}
>(
  {
    cloudant,
    ...options
  }: CreateCouchDbModuleArgs<Config, Session, Context, SelfResolvers>,
  moduleConfig?: Config
) {
  const { search, ...couchdbQueries } = queries

  const typeDefs = [
    base.typeDefs,
    ...Object.keys(cloudant ? queries : couchdbQueries).map(
      key => queries[key].typeDefs
    ),
    ...Object.keys(mutations).map(key => mutations[key].typeDefs),
  ]

  const queryResolvers = Object.keys(
    cloudant ? queries : couchdbQueries
  ).reduce(
    (resolvers, key) => ({
      ...resolvers,
      ...queries[key].resolvers.Query,
    }),
    {}
  )
  const mutationResolvers = Object.keys(mutations).reduce(
    (resolvers, key) => ({
      ...resolvers,
      ...mutations[key].resolvers.Mutation,
    }),
    {}
  )

  return new GraphQLModule(
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
