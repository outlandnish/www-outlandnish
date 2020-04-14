import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import timeToRead from '../utils/time-to-read'
import styles from './article-preview.module.css'

export default ({ article }) => (
  <div className={styles.preview}>
    <Link to={`/blog/${article.slug}`}><Img alt={article.title} fluid={article.heroImage.fluid} /></Link>
    <h4 className={`${styles.previewTitle} post-header`}>
      <Link to={`/blog/${article.slug}`}>{article.title}</Link>
    </h4>
    <small className="text-gray">{article.publishDate} • {timeToRead(article)}</small>
    <div className='divider'></div>
    <div
      dangerouslySetInnerHTML={{
        __html: article.description.childMarkdownRemark.html,
      }}
    />
  </div>
)
