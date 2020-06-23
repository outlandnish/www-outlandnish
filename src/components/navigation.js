import React from 'react'
import { Link } from 'gatsby'
import Logo from '../images/outlandnish.svg'
import styles from './navigation.module.css'

export default () => (
  <header className={`${styles.nav} navbar`}>
    <section className="navbar-section">
      <Link to="/"><img className={`${styles.logoImage} navbar-brand`} src={Logo} alt="OTLNDNSH" /></Link>
    </section>
    <section className="navbar-section">
      <Link to="/blog" className="btn btn-link">Blog</Link>
      <Link to="/hacks" className="btn btn-link">Hacks</Link>
      <a href="https://outlandnish.racing" target="_blank" className="btn btn-link">Racing</a>
      <a href="https://drive.google.com/file/d/1t6kU_XV0DH66gy9zf1DxUPcvCg4-VfHU/view?usp=sharing" target="_blank" className="btn btn-link">Resume</a>
    </section>
  </header>
)
