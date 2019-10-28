import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      db: process.env.REACT_APP_DB_NAME,
    },
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
export default client
