import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import styles from './timeline-article-preview.module.css'

export default ({ post }) => (
  <div className={`tile ${styles.monthGroup}`}>
    <div className="tile-content columns">
      <div className="column col-3 col-sm-12">
      <Link to={`/blog/${post.slug}`}><Img fluid={post.heroImage.fluid} fadeIn={true} /></Link>
      </div>
      <div className="column col-6 col-sm-12">
        <h5 className={`tile-title ${styles.timelinePreviewTitle}`}><Link to={`/blog/${post.slug}`}>{post.title}</Link></h5>
        <small className="small text-gray">{post.published} <span class="separator">• { post.body.childMarkdownRemark.timeToRead } min read</span></small>
        <p>{post.description.description}</p>
      </div>
    </div>
  </div>
)