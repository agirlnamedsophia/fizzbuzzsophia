import React from 'react'
import { Link } from 'react-router-dom'

const PostNavigation = (props) => (
  <div className='PostNavigation'>
    <Link to={{
      search: `?page=${props.currentPage + 1}`,
      state: { fromDashboard: true },
      title: "current page"
    }}>Next</Link>
  </div>
)

export default PostNavigation
