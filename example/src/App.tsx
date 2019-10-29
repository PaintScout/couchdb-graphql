import React, { useState, useEffect } from 'react'
import SearchQuotes from './components/SearchQuotes'
import SearchContacts from './components/SearchContacts'
import Quote from './components/Quote'
import { Router, Switch, Route } from 'react-router'
import { createBrowserHistory } from 'history'
import { Link } from 'react-router-dom'
import client from './util/apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import { SnackbarProvider } from 'notistack'

const App: React.FC = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    client.hydrated().then(() => setHydrated(true))
  }, [])

  if (!hydrated) {
    return null
  }

  return (
    <SnackbarProvider>
      <ApolloProvider client={client}>
        <Router history={createBrowserHistory()}>
          <ul>
            <li>
              <Link to="/">Quotes</Link>
            </li>
            <li>
              <Link to="/contacts">Contacts</Link>
            </li>
          </ul>
          <Switch>
            <Route path="/contacts" exact component={SearchContacts} />
            <Route path="/quote/:id" exact component={Quote} />
            <Route path="/" exact component={SearchQuotes} />
          </Switch>
        </Router>
      </ApolloProvider>
    </SnackbarProvider>
  )
}

export default App
