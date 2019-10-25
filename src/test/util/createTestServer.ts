import { createTestClient } from 'apollo-server-testing'
import { createServer } from '../../createServer'

export const dbName = 'test'
export const dbUrl = 'https://fakeeeeeee.url/test'

export function createTestServer() {
  return createTestClient(
    createServer({
      setContext: () => ({
        dbName,
        dbUrl,
      }),
    })
  )
}
