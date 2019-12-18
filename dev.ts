import { ApolloServer, gql } from 'apollo-server'
import { createContext } from './src/createContext'
import { CouchDBModule } from './src/CouchDBModule'

const { schema, context } = new CouchDBModule({
  cloudant: true,
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

const server = new ApolloServer({
  schema,
  context,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
