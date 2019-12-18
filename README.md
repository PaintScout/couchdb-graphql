# CouchDB GraphQL Server

An Apollo Server for interacting with a CouchDB or Cloudant server

# Usage

```js
import { ApolloServer } from 'apollo-server'
import { createCouchDbModule } from 'couchdb-graphql'
import { Request } from 'express'

// Creates a GraphQLModule from '@graphql-modules/core'
const { schema, context } = createCouchDbModule({
  // includes extra resolvers for cloudant-specific functionality
  cloudant: true,

  // set dbUrl and dbName in context however you wish
  context: ({ req }) => {
    return {
      // required
      dbUrl: 'https://my-couchdb-url.com',
      dbName: 'my-database',

      // optional
      dbHeaders: { ... }, // headers to be sent for requests made to couchdb

      // optional - is called to resolve a document if a save is rejected by a conflict
      async onResolveConflict({ document, conflicts }) {
        // upserts document
        return document
      },

      // optional - called when documents have been successfully resolved
      onConflictsResolved({ documents, context }) {
        console.log('Documents resolved:')
        console.log(documents)
      },

      // optional - called after documents are saved
      onDocumentsSaved({ documents, context }) {
        console.log('Documents saved:')
        console.log(documents)
      },
    }
  },
})

const server = new ApolloServer({
  schema,
  context
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
```

# Development

- run

  ```cli
  DB_URL=<couchdb-url> DB_NAME=<db-name>yarn dev
  ```

- open up the GraphiQL editor at http://localhost:4000
