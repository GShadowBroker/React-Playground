import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Phonebook from './components/Phonebook'
import Home from './components/Home'
import Notes from './components/Notes'
import Countries from './components/Countries'

const App = () => {
  
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/phonebook">Phonebook</Link>
          </li>
          <li>
            <Link to="/notes">Notes</Link>
          </li>
          <li>
            <Link to="/countries">Countries</Link>
          </li>
        </ul>
      </nav>  
      <Switch>
        <Route path="/phonebook">
          <Phonebook />
        </Route>
        <Route path="/notes">
          <Notes />
        </Route>
        <Route path="/countries">
          <Countries />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))