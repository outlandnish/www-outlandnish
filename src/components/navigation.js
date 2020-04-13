import React from 'react'
import { Link } from 'gatsby'
import Logo from '../images/logo.svg'
import styles from './navigation.module.css'

import { FaInstagram, FaGithub, FaSpotify } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

export default () => (
  <header className={`${styles.nav} navbar`}>
    <section className="navbar-section">
      <Link to="/"><img className={`${styles.logoImage} navbar-brand`} src={Logo} /></Link>
      <Link to="/blog" className="btn btn-link">Blog</Link>
      <Link to="/hacks" className="btn btn-link">Hacks</Link>
      <a href="https://drive.google.com/file/d/1t6kU_XV0DH66gy9zf1DxUPcvCg4-VfHU/view?usp=sharing" target="_blank" className="btn btn-link">Resume</a>
    </section>
    <section className="navbar-section">
      <a href="https://instagram.com/outlandnish" target="_blank" className={`btn btn-link ${styles.socialLink}`}><FaInstagram /></a>
      <a href="https://github.com/outlandnish"  target="_blank" className={`btn btn-link ${styles.socialLink}`}><FaGithub /></a>
      <a href="https://open.spotify.com/user/nishanthsamala?si=hdglQJ9LQlKRSQkxANMrhg"  target="_blank" className={`btn btn-link ${styles.socialLink}`}><FaSpotify /></a>
      <a href="mailto://hey@outlandnish.com"  target="_blank" className={`btn btn-link ${styles.socialLink}`}><MdEmail /></a>
    </section>
  </header>
)
