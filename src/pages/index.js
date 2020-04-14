import React from 'react'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import ArticlePreview from '../components/article-preview'
import styles from './index.module.css'

export default ({ data, location }) => {
  const siteTitle = get(data, `site.siteMetadata.title`)
  const posts = get(data, 'allContentfulBlogPost.edges')
  const me = get(data, `contentfulPerson.image.fluid`)

  return (
    <Layout location={location}>
        <Helmet title={siteTitle} />
        <div className="columns">
          <div className="column col-12">
            <div className="columns">
              <div className="column col-1 col-sm-7 col-md-3 col-mx-auto">
                <Img fluid={me} fadeIn={true} alt="Nishanth" className="s-circle" />
              </div>
              <div className="column col-mx-auto">
                <h2 className={styles.headerTitle}>👋🏽 Hey, it's Nishanth.</h2>
                <h4>I'm an entrepreneur, maker, and mobility nerd fascinated by the way people move around.</h4>
                <h4>Currently, I'm building <a href="https://ridewithamp.com" target="_blank"> the Amp</a> @ <a href="https://intentfulmotion.com" target="_blank">Intentful Motion.</a></h4>
              </div>
            </div>
          </div>
        </div>
      <section className={styles.summary}>
        <h5>Here's some other things you'll find me doing:</h5>
        <ul className="summary-list">
          <li>Bringing <Link to="/hacks">fun project ideas</Link> to life and contributing to <a href="https://github.com/outlandnish">open source</a></li>
          <li><a href="https://racing.outlandnish.com" target="_blank">Time attack competition and drift exhibitions</a></li>
          <li>Co-hosting the <a href="https://brakefastclub.com" target="_blank">Brakefast Club</a> podcast</li>
          <li>Any form of <a href="https://instagram.com/outlandnish" target="_blank">outdoor adventure</a></li>
          <li>E-skating, <a href="https://www.meetup.com/windycityboarders/">snowboarding</a>, and trail riding</li>
          <li>Wandering to intimate concert venues and <a href="https://open.spotify.com/user/nishanthsamala?si=hdglQJ9LQlKRSQkxANMrhg" target="_blank">discovering music</a></li>
        </ul>
        <p>Wanna chat or collaborate? Reach out and <a href="mailto://hey@outlandnish.com">say hey.</a></p>
      </section>
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
    </Layout>
  )
}

export const pageQuery = graphql`
  query HomeQuery {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }, limit: 3) {
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
    contentfulPerson(name: { eq: "Nishanth Samala" }) {
      name
      image: image {
        fluid(
          maxWidth: 480
          maxHeight: 480
          resizingBehavior: PAD
        ) {
          ...GatsbyContentfulFluid_tracedSVG
        }
      }
    }
  }
`
