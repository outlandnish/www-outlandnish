import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import SEO from '../components/SEO'
import Layout from '../components/layout'
import _ from 'lodash'
import { FaCalendarAlt } from 'react-icons/fa'
import TimelineArticlePreview from '../components/timeline-article-preview'

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default ({ data, location }) => {
  const siteTitle = get(data, 'site.siteMetadata.title')
  const posts = get(data, 'allContentfulBlogPost.edges').map(p => p.node)

  const groupedPosts = _.keyBy(posts, post => {
    let date = new Date(post.publishDate)
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  })

  return (
    <Layout location={location}>
      <div style={{ background: '#fff' }}>
        <SEO title={`Hacks | ${siteTitle}`} />
        <div className="wrapper">
          <h2>Hacks</h2>
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
                      typeof(groupedPosts[group]) === 'array' ? groupedPosts.map(post => (<TimelineArticlePreview post={post} key={post.slug} />)) : <TimelineArticlePreview post={groupedPosts[group]} />
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
  query HacksQuery {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }, filter: {tags: {in: "hack"}}) {
      edges {
        node {
          title
          slug
          publishDate
          published: publishDate(formatString: "MMMM Do, YYYY")
          heroImage {
            fluid(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
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
