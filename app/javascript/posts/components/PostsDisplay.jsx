import React from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'

import Post from './Post'

class PostsDisplay extends React.Component {
  constructor() {
    super()
    this.state = {
      posts: {},
      fetched: false
    }
  }

  fetchPosts(page) {
    if(this.state.fetched == false) {
      axios.get(`api/v1/posts`)
        .then(response => {
          this.setState({
            posts: response.data,
            fetched: true
          })
        })
        .catch(error => {
          console.error(error)
        })
    }
  }

  setPageFromQueryString(qs) {
    this.qsParams = queryString.parse(qs)
    if(this.qsParams.page) {
      this.page = Number(this.qsParams.page)
    } else {
      this.page = this.props.startingPage
      this.props.history.push(`/?page=${this.page}`)
    }
  }

  componentDidMount() {
    this.setPageFromQueryString(this.props.location.search)
    this.fetchPosts(this.page)
  }

  componentWillReceiveProps(nextProps) {
    this.setPageFromQueryString(nextProps.location.search)
    this.fetchPosts(this.page)
  }

  render() {
    const posts = this.state.posts
    return(
      <div>
        {this.state.fetched && posts &&
          posts.map((post) =>
            <Post key={post.id} post={post} />
          )
        }
      </div>
    )
  }
}

export default PostsDisplay
