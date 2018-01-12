import React from 'react'
import queryString from 'query-string'
import axios from 'axios'
import Loading from 'react-loading-animation'

import PostTitle from './PostTitle'
import PostBody from './PostBody'
class PostsDisplay extends React.Component {
  constructor() {
    super()
    this.state = {
      posts: {},
      fetchedPosts: false,
      currentPage: 1,
    }
  }

  fetchPosts(page) {
    if(this.state.fetchedPosts == false) {
      axios.get(`/api/v1/posts`, {
        params: {
          page: page
        }
      })
        .then(response => {
          this.setState({
            posts: response.data,
            fetchedPosts: true,
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

  isFetching() {
    !this.state.fetchedPosts
  }

  render() {
    const posts = this.state.posts

    return(
      <div>
        {
          !this.state.fetchedPosts &&
          <Loading />
        }
        {this.state.fetchedPosts && posts &&
          posts.map((post) =>
            <div key={post.id} className="PostContainer">
              <PostTitle post={post} />
              <PostBody post={post} body={post.short_body} />
            </div>
          )
        }
      </div>
    )
  }
}

export default PostsDisplay
