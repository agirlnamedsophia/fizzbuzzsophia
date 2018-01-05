import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

const posts = document.querySelector('#posts')
ReactDOM.render(<App startingPage={posts.dataset.startingPage}/>, posts)
