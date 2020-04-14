import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import timeToRead from '../utils/time-to-read'

export default ({ post }) => (
  <div className="tile">
    <div className="tile-content columns">
      <div className="column col-2">
        <Img fluid={post.heroImage.fluid} fadeIn={true} />
      </div>
      <h5 className="tile-title"><Link to={`/blog/${post.slug}`}>{post.title}</Link><span className="text-gray"> • { timeToRead(post) }</span></h5>
    </div>
  </div>
)