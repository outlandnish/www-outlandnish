import React from 'react'
import { useStaticQuery, graphql, Link } from "gatsby"

import { FaInstagram, FaGithub, FaSpotify, FaRss } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

export default () => {
  let { links, email } = useStaticQuery(query).site.siteMetadata

  return (
    <section>
      <div className="divider"></div>
      <div className="footer text-gray text-center">
        <a href={links.github}  target="_blank" rel="noopener" className="btn btn-link social-link"><FaGithub /></a>
        <a href={links.instagram} target="_blank" rel="noopener" className="btn btn-link social-link"><FaInstagram /></a>
        <a href={links.spotify} target="_blank" rel="noopener" className="btn btn-link social-link"><FaSpotify /></a>
        <a href={`mailto:${email}`}  target="_blank" rel="noopener" className="btn btn-link social-link"><MdEmail /></a>
        <Link to={links.rss} className="btn btn-link social-link"><FaRss /></Link>
        <section className="text-primary">Outlandnish &copy; 2020</section>
      </div>
    </section>
  )
}

const query = graphql`
  query footer {
    site {
      siteMetadata {
        links {
          github
          instagram
          spotify
          rss
        }
        email
      }
    }
  }
`