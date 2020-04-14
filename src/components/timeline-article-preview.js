import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import timeToRead from '../utils/time-to-read'
import styles from './timeline-article-preview.module.css'

export default ({ post }) => (
  <div className="tile">
    <div className="tile-content columns">
      <div className="column col-2 col-sm-6">
      <Link to={`/blog/${post.slug}`}><Img fluid={post.heroImage.fluid} fadeIn={true} /></Link>
      </div>
      <h5 className={`tile-title ${styles.timelinePreviewTitle}`}><Link to={`/blog/${post.slug}`}>{post.title}</Link></h5>
      <p className="small text-gray"><span className={styles.separator}>&nbsp;• </span>{ timeToRead(post) }</p>
    </div>
  </div>
)