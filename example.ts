import { ApolloServer } from 'apollo-server'
import { createCouchDbModule, createContext } from './src'

function chooseWinner<T>(docs: T[], chooser: (a: T, b: T) => T) {
  return docs.sort((a, b) => {
    const chosen = chooser(a, b)

    return chosen === a ? -1 : 1
  })[0]
}

const { schema, context } = createCouchDbModule({
  cloudant: true,
  context: ({ req }) => {
    if (!req.headers.db) {
      throw Error('Provide a db name in `db` header')
    }
    return createContext({
      dbUrl: process.env.DB_URL as string,
      // go to http://localhost:4000 and set the header to the db name you want to query against
      dbName: req.headers.db as string,
      onResolveConflict({ document, conflicts, context }) {
        return chooseWinner([document, ...conflicts], (a, b) => {
          return a.updated > b.updated ? a : b
        })
      },
      onConflictsResolved({ documents }) {
        // console.log('Documents resolved:')
        // console.log(documents)
      },
    })
  },
})

const server = new ApolloServer({
  // @ts-ignore
  schema,
  context,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
