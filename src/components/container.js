import React from 'react'

export default ({ children }) => (
  <div className="container">
    <div className="columns">
      <div className="column col-9 col-sm-12 col-md-12 col-lg-9 col-xl-6 col-mx-auto">
        {children}
      </div>
    </div>
  </div>
)
