import React from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'

class PostsDisplay extends React.Component {
  constructor() {
    super()
    this.state = {
      post: {}
    }
  }

  fetchPost(id) {
    axios.get(`api/v1/posts/${id}`)
      .then(response => {
        this.setState({ post: response.data })
      })
      .catch(error => {
        console.error(error)
      })
  }

  setPostIdFromQueryString(qs) {
    this.qsParams = queryString.parse(qs)
    if(this.qsParams.post) {
      this.postId = Number(this.qsParams.post)
    } else {
      this.postId = this.props.startingPostId
      this.props.history.push(`/?post=${this.postId}`)
    }
  }

  componentDidMount() {
    this.setPostIdFromQueryString(this.props.location.search)
    this.fetchPost(this.postId)
  }

  componentWillReceiveProps(nextProps) {
    this.setPostIdFromQueryString(nextProps.location.search)
    this.fetchPost(this.postId)
  }

  render() {
    const post = this.state.post

    return (
      <div>
        <p>{this.state.post.title}</p>
        <p>{this.state.post.body}</p>
      </div>
    )
  }
}

export default PostsDisplay
