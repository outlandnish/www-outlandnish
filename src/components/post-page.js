import React from 'react'
import { Link, graphql } from 'gatsby'

import SEO from '../components/SEO'
import Layout from '../components/layout'

import { FaCalendarAlt } from 'react-icons/fa'
import TimelineArticlePreview from '../components/timeline-article-preview'

import _ from 'lodash'

export default ({ title, subtitle, posts, location }) => (
  <Layout location={location}>
    <div style={{ background: '#fff' }}>
    <SEO title={title} />
      <div className="wrapper">
        <h2>{ subtitle }</h2>
        <div className="timeline">
          {
            Object.keys(posts).map(group => (
              <div className="timeline-item" id={group} key={group}>
                <div className="timeline-left">
                  <Link to={`/blog#${group}`} className="timeline-icon icon-lg"><FaCalendarAlt /></Link>
                </div>
                <div className="timeline-content">
                  <h5 className="text-dark">{group}</h5>
                  { 
                    posts[group]
                      .map(post => (<TimelineArticlePreview post={post} key={post.slug} />))
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  </Layout>
)