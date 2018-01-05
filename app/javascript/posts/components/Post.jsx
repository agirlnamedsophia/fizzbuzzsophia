import React from 'react';

import PostTitle from './PostTitle'
import PostBody from './PostBody'

const Post = (props) => (
  <div>
    <div className='PostContainer foobar'>
      <PostTitle post={props.post} />
      <PostBody post={props.post} />
    </div>
  </div>
)

export default Post
