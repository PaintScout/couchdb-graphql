import { ApolloServer } from 'apollo-server'
import { createSchema } from './src'
import { createContext } from './src/createContext'

const server = new ApolloServer({
  schema: createSchema(),
  context: ({ req }) => {
    return createContext({
      dbUrl: process.env.DB_URL,
      dbName: req.headers.db as string,
      onResolveConflict({ document, conflicts, context }) {
        return document
      },
      onConflictsResolved({ documents }) {
        console.log('Documents resolved:')
        console.log(documents)
      },
    })
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
