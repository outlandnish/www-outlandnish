import React from 'react'
import { Link } from 'gatsby'
import base from './base.scss'
import Container from './container'
import Navigation from './navigation'

import { FaInstagram, FaGithub, FaSpotify } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

class Template extends React.Component {
  render() {
    const { location, children } = this.props
    let header

    let rootPath = `/`
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      rootPath = __PATH_PREFIX__ + `/`
    }

    return (
      <Container>
        <Navigation />
        {children}
        <div className="divider"></div>
        <div className="footer text-gray text-center">
          <a href="https://instagram.com/outlandnish" target="_blank" className="btn btn-link social-link"><FaInstagram /></a>
          <a href="https://github.com/outlandnish"  target="_blank" className="btn btn-link social-link"><FaGithub /></a>
          <a href="https://open.spotify.com/user/nishanthsamala?si=hdglQJ9LQlKRSQkxANMrhg"  target="_blank" className="btn btn-link social-link"><FaSpotify /></a>
          <a href="mailto://hey@outlandnish.com"  target="_blank" className="btn btn-link social-link"><MdEmail /></a>
          <section className="text-primary">Outlandnish &copy; 2020</section>
        </div>
      </Container>
    )
  }
}

export default Template
