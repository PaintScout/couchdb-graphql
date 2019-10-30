import { ApolloServer, gql, GraphQLSchemaModule } from 'apollo-server'

import { buildFederatedSchema } from '@apollo/federation'

import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'
import {
  ContextFunction,
  Context,
  AuthenticationError,
} from 'apollo-server-core'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'

export interface CreateServerOptions {
  dbUrl: string
  setContext?: ContextFunction<ExpressContext, Context>
  schemas?: GraphQLSchemaModule[]
}

export function createServer({
  dbUrl,
  setContext,
  schemas = [],
}: CreateServerOptions) {
  const base = gql`
    scalar JSON
  `

  if (!dbUrl) {
    console.warn('Cannot find dbUrl - did you pass it into createServer()?')
  }

  const server = new ApolloServer({
    schema: buildFederatedSchema([
      { typeDefs: base },
      ...Object.keys(queries).map(key => queries[key]),
      ...Object.keys(mutations).map(key => mutations[key]),
      ...schemas,
    ] as any),
    context: async args => {
      const { req } = args
      let context: any = {}

      if (setContext) {
        context = await setContext(args)
      }

      if (!context.dbName) {
        throw new Error('dbName is required to exist in context')
      }

      return {
        dbUrl: `${context.dbUrl || dbUrl}/${context.dbName}`,
        ...context,
      }
    },
  })

  return server
}
