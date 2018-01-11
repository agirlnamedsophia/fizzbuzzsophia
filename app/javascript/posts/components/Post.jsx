import React from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios'

import PostTitle from './PostTitle'
import PostBody from './PostBody'

class Post extends React.Component {
  constructor() {
    super()
    this.state = {
      fetched: false,
      post: {}
    }
  }

  fetchPost(id) {
    if(this.state.fetched == false) {
      axios.get(`/api/v1/posts/${id}`)
        .then(response => {
          this.setState({
            post: response.data,
            fetched: true,
            postId: id
          })
        })
        .catch(error => {
          console.error(error)
        })
    }
  }

  componentDidMount() {
    this.fetchPost(parseInt(this.props.match.params.id))
  }

  componentWillReceiveProps(nextProps) {
    this.fetchPost(parseInt(this.state.postId))
  }

  render() {
    const post = this.state.post

    return(
      <div>
        <div className='PostContainer'>
          {this.state.fetched && post &&
            <div>
              <PostTitle post={post} />
              <PostBody body={post.body} post={post} />
            </div>
          }
        </div>
      </div>
    )
  }
}

export default Post
