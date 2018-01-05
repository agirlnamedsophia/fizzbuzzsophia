import React from 'react'
import queryString from 'query-string'
import axios from 'axios'

import Post from './Post'
import PostNavigation from './PostNavigation'

class PostsDisplay extends React.Component {
  constructor() {
    super()
    this.state = {
      posts: {},
      fetched: false,
      currentPage: 1,
    }
  }

  fetchPosts(page) {
    if(this.state.fetched == false) {
      axios.get(`api/v1/posts`, {
        params: {
          page: page
        }
      })
        .then(response => {
          this.setState({
            posts: response.data,
            fetched: true,
            currentPage: page,
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
      this.setState({ currentPage: Number(this.qsParams.page) })
    } else {
      this.props.history.push(`/?page=${this.state.currentPage}`)
    }
  }

  componentDidMount() {
    this.setPageFromQueryString(this.props.location.search)
    this.fetchPosts(this.state.currentPage)
  }

  componentWillReceiveProps(nextProps) {
    this.setPageFromQueryString(nextProps.location.search)
    this.fetchPosts(this.state.currentPage)
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
