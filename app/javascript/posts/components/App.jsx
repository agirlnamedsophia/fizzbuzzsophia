import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import PostsDisplay from './PostsDisplay'
import Post from './Post'

const App = (props) => (
  <Router>
    <div>
      <Route exact={true} path='/' render={(routeProps) => <PostsDisplay {...props} {...routeProps} /> } />
      <Route path='/posts/:id' render={(routeProps) => <Post {...props} {...routeProps} /> } />
    </div>
  </Router>
)

export default App
