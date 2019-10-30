import { createTestClient } from 'apollo-server-testing'
import { ApolloServer } from 'apollo-server'
import { createSchema } from '../../createSchema'

export const dbName = 'test'
export const dbUrl = 'https://fakeeeeeee.url/test'

export function createTestServer() {
  return createTestClient(
    new ApolloServer({
      schema: createSchema(),
      context: () => ({
        dbName,
        dbUrl,
      }),
    })
  )
}
