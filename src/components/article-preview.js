import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import styles from './article-preview.module.css'

export default ({ article }) => {
  const partial = article.tags.indexOf('overshare') >= 0 ? 'overshare' : article.tags.indexOf('hack') >= 0 ? 'hacks' : 'blog'
  return (
    <div className={styles.preview}>
      <Link to={`/${partial}/${article.slug}`}><Img alt={article.title} fluid={article.heroImage.fluid} /></Link>
      <h4 className={`${styles.previewTitle} post-header`}>
        <Link to={`/${partial}/${article.slug}`}>{article.title}</Link>
      </h4>
      <small className="text-gray">{article.publishDate} • {article.body.childMarkdownRemark.timeToRead} min read</small>
      <div className='divider'></div>
      <div
        dangerouslySetInnerHTML={{
          __html: article.description.description,
        }}
      />
    </div>
  )
}
