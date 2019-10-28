require('dotenv').config()

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
  setContext?: ContextFunction<ExpressContext, Context>
}

export function createServer({ setContext }: CreateServerOptions = {}) {
  const base = gql`
    scalar JSON
  `

  const server = new ApolloServer({
    schema: buildFederatedSchema([
      { typeDefs: base },
      ...Object.keys(queries).map(key => queries[key]),
      ...Object.keys(mutations).map(key => mutations[key]),
    ] as any),
    context: async args => {
      const { req } = args
      let context = {}

      if (setContext) {
        context = await setContext(args)
      }

      // this would ideally be jwt token decryption, but for testing it'll just be the header.db value
      const dbName = req ? req.headers.db : ''

      if (!dbName) {
        throw new AuthenticationError('Authentication required')
      }
      return {
        dbName,
        dbUrl: `${process.env.PS_DB_ADMIN_URL}/${dbName}`,
        ...context,
      }
    },
  })

  return server
}
