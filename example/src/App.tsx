import React from 'react'
import SearchQuotes from './components/SearchQuotes'
import SearchContacts from './components/SearchContacts'
import { Router, Switch, Route } from 'react-router'
import { createBrowserHistory } from 'history'
import { Link } from 'react-router-dom'

const App: React.FC = () => {
  return (
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
        <Route path="/" exact component={SearchQuotes} />
      </Switch>
    </Router>
  )
}

export default App
