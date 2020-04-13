import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import styles from './blog.module.css'
import Layout from '../components/layout'
import _ from 'lodash'
import { FaCalendarAlt } from 'react-icons/fa'

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default ({ data, location }) => {
  const siteTitle = get(data, 'site.siteMetadata.title')
  const posts = get(data, 'allContentfulBlogPost.edges').map(p => p.node)

  const groupedPosts = _.keyBy(posts, post => {
    let date = new Date(post.publishDate)
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  })

  const timeToRead = (post) => {
    let content = post.body.childMarkdownRemark.html
    let wordCount = content.replace( /[^\w ]/g, "" ).split( /\s+/ ).length
    let readingTimeInMinutes = Math.floor(wordCount / 228) + 1
    return readingTimeInMinutes + " min read"
  }

  return (
    <Layout location={location}>
      <div style={{ background: '#fff' }}>
        <Helmet title={siteTitle} />
        <div className="wrapper">
          <h2>Previous posts</h2>
          <div className="timeline">
            {
              Object.keys(groupedPosts).map(group => (
                <div className="timeline-item" id={group} key={group}>
                  <div className="timeline-left">
                    <Link to={`/blog#${group}`} className="timeline-icon icon-lg"><FaCalendarAlt /></Link>
                  </div>
                  <div className="timeline-content">
                    <h5 className="text-dark">{group}</h5>
                    {
                      typeof(groupedPosts[group]) === 'array' ? groupedPosts.map(post => {
                        <div className="tile">
                          <div className="tile-content">
                            <p className="tile-title"><Link to={`/blog/${post.slug}`}>{post.title}</Link> - <span className="text-light">{ timeToRead(groupedPosts[group]) }</span></p>
                          </div>
                        </div>
                        }
                      ) : 
                      <div className="tile">
                        <div className="tile-content">
                          <p className="tile-title"><Link to={`/blog/${groupedPosts[group].slug}`}>{groupedPosts[group].title}</Link> - { timeToRead(groupedPosts[group]) }</p>
                        </div>
                      </div>
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
}

export const pageQuery = graphql`
  query BlogIndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }) {
      edges {
        node {
          title
          slug
          publishDate
          body {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
  }
`
