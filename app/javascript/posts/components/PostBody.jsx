import React from 'react';

const ReactMarkdown = require('react-markdown')

const PostBody = (props) => (
  <div className='PostBody'>
    <ReactMarkdown source={props.body} />
  </div>
)

export default PostBody
