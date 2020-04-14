import React from 'react'
import base from './base.scss'
import Container from './container'
import Navigation from './navigation'
import Footer from './footer'

class Template extends React.Component {
  render() {
    const { location, children } = this.props

    let rootPath = `/`
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      rootPath = __PATH_PREFIX__ + `/`
    }

    return (
      <Container>
        <Navigation />
        {children}
        <Footer />
      </Container>
    )
  }
}

export default Template
