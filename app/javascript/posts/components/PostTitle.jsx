import React from 'react';
import { Link } from 'react-router-dom'

const PostTitle = (props) => (
  <div className='PostTitle'>
    <Link
      to={{
        pathname: `/posts/${props.post.id}`,
        state: { fromDashboard: true },
        title: `${props.post.title}`
      }}
      replace>
      {props.post.title}
    </Link>
    <div className="Post--date">{ props.post.created_at }</div>
  </div>
)

export default PostTitle
