import { ApolloServer } from 'apollo-server'
import { createSchema, CouchDbContext } from './src'

const server = new ApolloServer({
  schema: createSchema(),
  context: ({ req }) => {
    return {
      dbUrl: process.env.DB_URL,
      // dbName: req.headers.db,
      dbName: 'yhufhcglgjveqzgn',
      onResolveConflict({ document, conflicts, context }) {
        return document
      },
    } as CouchDbContext
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
