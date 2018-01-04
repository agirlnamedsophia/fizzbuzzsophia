// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const Post = props => (
  <div>Post {props.title}!</div>
)

Post.defaultProps = {
  title: 'David'
}

Post.propTypes = {
  title: PropTypes.string
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Post title="Sophia" />,
    document.body.appendChild(document.createElement('div')),
  )
})
