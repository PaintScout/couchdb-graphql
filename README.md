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
      dbUrl: 'https://my-couchdb-url.com',
      dbName: 'my-database',
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
