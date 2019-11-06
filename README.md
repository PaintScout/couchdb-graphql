# Cloudant GraphQL Server

proof of concept for a Cloudant GraphQL server

# Usage

```js
import { ApolloServer } from 'apollo-server'
import { createSchema } from 'couchdb-graphql'

const server = new ApolloServer({
  schema: createSchema(),

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

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
```

# Development

- run

  ```cli
  DB_URL=<admin-couchdb-url> yarn dev
  ```

- open up the GraphiQL editor at http://localhost:4000

- set the `HTTP HEADERS` at the bottom to

  ```json
  {
    "db": "your-database-name"
  }
  ```

- now you can make requests in the GraphiQL editor
