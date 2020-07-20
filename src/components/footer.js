import React from 'react'

import { FaInstagram, FaGithub, FaSpotify } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

export default () => (
  <section>
    <div className="divider"></div>
    <div className="footer text-gray text-center">
      <a href="https://github.com/outlandnish"  target="_blank" rel="noopener" className="btn btn-link social-link"><FaGithub /></a>
      <a href="https://instagram.com/outlandnish" target="_blank" rel="noopener" className="btn btn-link social-link"><FaInstagram /></a>
      <a href="https://open.spotify.com/user/nishanthsamala?si=hdglQJ9LQlKRSQkxANMrhg" target="_blank" rel="noopener" className="btn btn-link social-link"><FaSpotify /></a>
      <a href="mailto:hey@outlandnish.com"  target="_blank" rel="noopener" className="btn btn-link social-link"><MdEmail /></a>
      <section className="text-primary">Outlandnish &copy; 2020</section>
    </div>
  </section>
)