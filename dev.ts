import { ApolloServer } from 'apollo-server'
import { createSchema, CouchDbContext } from './src'

const server = new ApolloServer({
  schema: createSchema(),
  context: ({ req }) => {
    return {
      dbUrl: process.env.DB_URL,
      dbName: req.headers.db,
      onResolveConflict({ document, conflicts, context }) {
        return document
      },
      onConflictsResolved(documents) {
        console.log('Documents resolved:')
        console.log(documents)
      },
    } as CouchDbContext
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
