import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import PostsDisplay from './PostsDisplay'

const App = (props) => (
  <Router startingPage={props.startingPage}>
    <div>
      <Route
        path='/'
        startingPage={props.startingPage}
        render={(routeProps) => <PostsDisplay {...props} {...routeProps} /> }
      />
    </div>
  </Router>
)

export default App

