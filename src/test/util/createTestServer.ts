import { createTestClient } from 'apollo-server-testing'
import { ApolloServer } from 'apollo-server'
import { createContext } from '../../createContext'
import { CouchDBModule } from '../../CouchDBModule'

export const dbName = 'test'
export const dbUrl = 'https://fakeeeeeee.url'

const { schema, context } = new CouchDBModule({
  cloudant: true,
  context: () => {
    return createContext({
      dbName,
      dbUrl,
    })
  },
})
export function createTestServer() {
  return createTestClient(
    new ApolloServer({
      schema,
      context,
    })
  )
}
