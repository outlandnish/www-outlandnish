import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import _ from 'lodash'

import PostPage from '../components/post-page'

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const now = new Date().toISOString()

export default ({ data, location }) => {
  const posts = get(data, 'allContentfulBlogPost.edges').map(p => p.node)

  const groupedPosts = _.groupBy(posts, post => {
    let date = new Date(post.publishDate)
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  })

  return <PostPage title="Hacks" subtitle="Hacks" posts={groupedPosts} location={location} />
}

export const pageQuery = graphql`
  query HacksQuery($now: Date) {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }, filter: {tags: {in: "hack"}, publishDate: { lte: $now }}) {
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
