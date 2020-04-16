import React from 'react'
import { graphql } from 'gatsby'
import SEO from '../components/SEO'
import get from 'lodash/get'
import Img from 'gatsby-image'
import Layout from '../components/layout'
import heroStyles from '../components/hero.module.css'
import blogPostStyles from './blog-post.module.css'
import timeToRead from '../utils/time-to-read'

class BlogPostTemplate extends React.Component {
  render() {
    const post = get(this.props, 'data.contentfulBlogPost')

    return (
      <Layout location={this.props.location}>
        <div style={{ background: '#fff' }}>
          <SEO
            title = {post.title}
            description = {post.description.description}
            image = {`https:${post.heroImage.file.url}`}
            publishDate = {post.publishDate}
            modifiedDate = {post.updatedAt}
            tags = {post.tags}
            article = {true}
          />
          <div className={heroStyles.hero}>
            <Img
              className={heroStyles.heroImage}
              alt={post.title}
              fluid={post.heroImage.fluid}
            />
          </div>
          <div className="wrapper">
            <div className="columns">
              <div className="column col-8 col-sm-12 col-mx-auto">
                <h1 className={blogPostStyles.postHeader}>{post.title}</h1>
                <small className="text-gray">{post.published} • {timeToRead(post)}</small>
                <div className={`divider ${blogPostStyles.postStart}`}></div>
                <div id={blogPostStyles.postContent}
                  dangerouslySetInnerHTML={{
                    __html: post.body.childMarkdownRemark.html,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishDate
      updatedAt
      published: publishDate(formatString: "MMMM Do, YYYY")
      heroImage {
        fluid(maxWidth: 1180) {
          ...GatsbyContentfulFluid
        }
        file {
          url
        }
      }
      description {
        description
      }
      body {
        childMarkdownRemark {
          html
        }
      }
      tags
    }
  }
`
