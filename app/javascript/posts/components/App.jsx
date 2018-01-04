import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import PostsDisplay from './PostsDisplay'

const App = (props) => (
  <Router startingPostId={props.startingPostId}>
    <div>
      <Route
        path='/'
        startingPostId={props.startingPostId}
        render={(routeProps) => <PostsDisplay {...props} {...routeProps} /> }
      />
    </div>
  </Router>
)

export default App

