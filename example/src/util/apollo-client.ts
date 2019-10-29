import { ApolloClient } from '@wora/apollo-offline'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import ApolloCache from '@wora/apollo-cache'
import filterKeys from '@wora/cache-persist/lib/layers/filterKeys'

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

const offlineOptions = {
  link: authLink.concat(httpLink),
}

const cache = new ApolloCache(
  {
    dataIdFromObject: o => o.id,
  },
  {
    mutateKeys: [
      filterKeys(key => {
        // don't save search results to storage
        return !key.includes('$ROOT_QUERY.search')
      }),
    ],
  }
)

const client = new ApolloClient(
  {
    link: authLink.concat(httpLink),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
    cache,
  },
  offlineOptions,
  {}
)

export { cache }
export default client
