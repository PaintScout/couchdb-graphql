require('dotenv').config()

import { ApolloServer, gql, GraphQLSchemaModule } from 'apollo-server'

import { buildFederatedSchema } from '@apollo/federation'

import { get, info, bulkGet } from './graphql/queries'
import { put, bulkDocs } from './graphql/mutations'
import { ContextFunction, Context } from 'apollo-server-core'
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
      get,
      info,
      put,
      bulkGet,
      bulkDocs,
    ] as any),
    context: args => {
      const { req } = args
      let context = {}

      if (setContext) {
        context = setContext(args)
      }

      // this would ideally be jwt token decryption, but for testing it'll just be the header.db value
      const dbName = req ? req.headers.db : ''

      return {
        dbName,
        dbUrl: `${process.env.PS_DB_ADMIN_URL}/${dbName}`,
        ...context,
      }
    },
  })

  return server
}
