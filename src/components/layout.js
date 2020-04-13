import React from 'react'
import { Link } from 'gatsby'
import base from './base.scss'
import Container from './container'
import Navigation from './navigation'

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
        <div className="footer text-gray">
          Outlandnish &copy; 2020
        </div>
      </Container>
    )
  }
}

export default Template
