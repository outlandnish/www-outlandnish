import React, { useState } from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import _ from 'lodash'
import AuthorizeHiddenPost from '../components/authorize-hidden-post'

import PostPage from '../components/post-page'
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default ({ data, location }) => {
  const [showPage, setShowPage] = useState(false)

  if (!showPage)
    return <AuthorizeHiddenPost location={location} approve={approved => setShowPage(approved)} />

  const posts = get(data, 'allContentfulBlogPost.edges').map(p => p.node)

  const groupedPosts = _.groupBy(posts, post => {
    let date = new Date(post.publishDate)
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  })

  return <PostPage title="Overshare" subtitle="Personal Posts" posts={groupedPosts} location={location} indexed={false} />
}

export const pageQuery = graphql`
  query OvershareQuery {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }, filter: {tags: {in: ["overshare"]} }) {
      edges {
        node {
          title
          slug
          publishDate
          published: publishDate(formatString: "MMMM Do, YYYY")
          heroImage {
            fluid(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
              ...GatsbyContentfulFluid
            }
          }
          body {
            childMarkdownRemark {
              timeToRead
            }
          }
          description {
            description
          }
        }
      }
    }
  }
`
