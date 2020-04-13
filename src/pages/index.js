import React from 'react'
import { graphql, Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import ArticlePreview from '../components/article-preview'

class RootIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allContentfulBlogPost.edges')

    return (
      <Layout location={this.props.location}>
        <div style={{ background: '#fff' }}>
          <Helmet title={siteTitle} />
          <div className="summary">
            <h1 className="summary-title">👋🏽 Hey, it's Nishanth.</h1>
            <h3>I'm an entrepreneur, maker, and mobility nerd fascinated by the way people move around.</h3>
            <h4>Currently, I'm building <a href="https://ridewithamp.com" target="_blank"> the Amp</a> @ <a href="https://intentfulmotion.com" target="_blank">Intentful Motion.</a></h4>

            <p>My other interests:</p>
            <ul className="summary-list">
              <li>I enjoy bringing <Link to="/hacks">fun project ideas to life</Link> and am a strong proponent of + contributor to <a href="https://github.com/outlandnish">open source</a></li>
              <li>I'm an amateur <a href="https://racing.outlandnish.com" target="_blank">time attack competitor and exhibition drifter</a>.</li>
              <li>I co-host <a href="https://brakefastclub.com" target="_blank">The Brakefast Club</a> podcast</li>
              <li>I'm an <a href="https://instagram.com/outlandnish" target="_blank">outdoors enthusiast, bicyclist, e-skater and snowboarder</a></li>
              <li>Music and intimate concert venues <a href="https://open.spotify.com/user/nishanthsamala?si=hdglQJ9LQlKRSQkxANMrhg" target="_blank">are my jam</a></li>
            </ul>
            <p>Wanna chat or collaborate? Reach out and <a href="mailto://hey@outlandnish.com">say hey.</a></p>
          </div>
          <h2 className="section-headline">Recent posts</h2>
          <ul className="article-list">
            {posts.map(({ node }) => {
              return (
                <li key={node.slug}>
                  <ArticlePreview article={node} />
                </li>
              )
            })}
          </ul>
        </div>
      </Layout>
    )
  }
}

export default RootIndex

export const pageQuery = graphql`
  query HomeQuery {
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
          publishDate(formatString: "MMMM Do, YYYY")
          tags
          heroImage {
            fluid(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
          description {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
    allContentfulPerson(
      filter: { contentful_id: { eq: "15jwOBqpxqSAOy2eOO4S0m" } }
    ) {
      edges {
        node {
          name
          shortBio {
            shortBio
          }
          title
          heroImage: image {
            fluid(
              maxWidth: 1180
              maxHeight: 480
              resizingBehavior: PAD
              background: "rgb:000000"
            ) {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
        }
      }
    }
  }
`
