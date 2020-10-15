import { ApolloServer } from 'apollo-server'
import { createCouchDbModule, createContext } from 'couchdb-graphql'

const { schema, context } = createCouchDbModule({
  cloudant: true,
  context: ({ req }) => {
    return createContext({
      dbUrl: process.env.DB_URL as string,
      // go to http://localhost:4000 and set the header to the db name you want to query against
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
