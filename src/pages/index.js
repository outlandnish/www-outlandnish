import React from 'react'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import get from 'lodash/get'
import SEO from '../components/SEO'
import Layout from '../components/layout'
import ArticlePreview from '../components/article-preview'
import styles from './index.module.css'

export default ({ data, location }) => {
  const posts = get(data, 'allContentfulBlogPost.edges')
  const me = get(data, `contentfulPerson.image.fluid`)
  const email = get(data, 'site.siteMetadata.email')

  return (
    <Layout location={location}>
        <SEO title="Outlandnish" />
        <div className="columns">
          <div className="column col-12">
            <div className="columns">
              <div className="column col-1 col-sm-7 col-md-3 col-mx-auto">
                <Img fluid={me} fadeIn={true} alt="Nishanth" className={`${styles.profilePic} s-circle`} />
              </div>
              <div className="column col-mx-auto">
                <h1 className={styles.headerTitle}>👋🏽 Hey, it's Nishanth.</h1>
                <h2 className={styles.headerDescription}>I'm a maker and mobility nerd fascinated by the way people move around.</h2>
              </div>
            </div>
          </div>
        </div>
      <section className={styles.summary}>
        <h5>Currently I'm working on<a href="https://ridewithamp.com" target="_blank" rel="noopener"> the Amp</a> @ <a href="https://intentfulmotion.com" target="_blank" rel="noopener">Intentful Motion</a>. Otherwise, you'll find me:</h5>
        <ul className="summary-list">
          <li>Bringing <Link to="/hacks">fun project ideas</Link> to life and contributing to <a href="https://github.com/outlandnish" target="_blank" rel="noopener">open source</a></li>
          <li><a href="https://www.outlandnish.racing" target="_blank" rel="noopener">Time attack competition and drift exhibitions</a></li>
          <li>Co-hosting the <a href="http://brakefastclub.com" target="_blank" rel="noopener">Brakefast Club</a> podcast</li>
          <li>Doing any form of <a href="https://instagram.com/outlandnish" target="_blank" rel="noopener">outdoor adventure and travel</a></li>
          <li>E-skating, <a href="https://www.meetup.com/windycityboarders/" target="_blank" rel="noopener">snowboarding</a>, and mountain biking</li>
          <li>Wandering to intimate concert venues and <a href="https://open.spotify.com/user/nishanthsamala?si=hdglQJ9LQlKRSQkxANMrhg" target="_blank" rel="noopener">discovering music</a></li>
        </ul>
        <p>Oh, and <a href="https://www.zebrasunite.com/">Zebras🦓 > Unicorns🦄</a></p>
        <p>Wanna chat or collaborate? Reach out and <a href={`mailto:${email}`}>say hey.</a></p>
      </section>
      <div className="divider"></div>
      <h2>Recent posts</h2>
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

const now = new Date().toISOString()

export const pageQuery = graphql`
  query HomeQuery($now: Date) {
    site {
      siteMetadata {
        title
        email
      }
    }
    allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }, limit: 3, filter: { publishDate: { lte: $now} }) {
      edges {
        node {
          title
          slug
          publishDate(formatString: "MMMM Do, YYYY")
          tags
          heroImage {
            fluid(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
              ...GatsbyContentfulFluid
            }
          }
          description {
            description
          }
          body {
            childMarkdownRemark {
              timeToRead
            }
          }
        }
      }
    }
    contentfulPerson(name: { eq: "Nishanth Samala" }) {
      name
      image: image {
        fluid(
          maxWidth: 256
          maxHeight: 256
          resizingBehavior: PAD
        ) {
          ...GatsbyContentfulFluid
        }
      }
    }
  }
`
