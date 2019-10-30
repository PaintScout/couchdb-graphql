import { ApolloServer } from 'apollo-server'
import { createSchema } from './src/createSchema'

const server = new ApolloServer({
  schema: createSchema(),
  context: ({ req }) => {
    return {
      dbUrl: process.env.DB_URL,
      dbName: req.headers.db,
    }
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
