import { createTestClient } from 'apollo-server-testing'
import { ApolloServer } from 'apollo-server'
import { createSchema } from '../../createSchema'
import { CouchDbContext } from '../../util/createResolver'

export const dbName = 'test'
export const dbUrl = 'https://fakeeeeeee.url'

export function createTestServer(context: Partial<CouchDbContext> = {}) {
  return createTestClient(
    new ApolloServer({
      schema: createSchema(),
      context: () => ({
        dbName,
        dbUrl,
        ...context,
      }),
    })
  )
}
