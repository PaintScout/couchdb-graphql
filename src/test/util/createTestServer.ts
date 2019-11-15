import { createTestClient } from 'apollo-server-testing'
import { ApolloServer } from 'apollo-server'
import { createSchema } from '../../createSchema'
import { createContext } from '../../createContext'

export const dbName = 'test'
export const dbUrl = 'https://fakeeeeeee.url'

export function createTestServer() {
  return createTestClient(
    new ApolloServer({
      schema: createSchema(),
      context: createContext({
        dbName,
        dbUrl,
      }),
    })
  )
}
