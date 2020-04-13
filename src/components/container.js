import React from 'react'

export default ({ children }) => (
  <div className="container">
    <div className="columns">
      <div className="column col-9 col-sm-11 col-md-11 col-lg-9 col-xl-9 col-mx-auto">
        {children}
      </div>
    </div>
  </div>
)
