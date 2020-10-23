import React, { useState } from 'react'
import Layout from '../components/layout'

export default ({ location, approve }) => {
  const [userPassword, setUserPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const checkPassword = async userInput => {
    setLoading(true)
    let response = await fetch('/.netlify/functions/approve', {
      method: 'POST',
      body: JSON.stringify({ password: userInput }),
      headers: { 'Content-Type': 'application/json' }
    })

    try {
      if (response.ok) {
        const { approved } = await response.json()
        approve(approved)
      }
      else {
        setLoading(false)
        alert('No luck, that password was incorrect')
      }
    }
    catch (err) {
      setLoading(false)
      approve(true)
      alert(`No luck, that password was incorrect or there's network issues`)
    }
  }

  return (
  <Layout location={location}>
    { loading && <h2>Checking...</h2> }
    { !loading && 
      <div style={{ background: '#fff' }}>
        <h2>You'll need a password to access this content</h2>
        <form>
          <input type="password" value={userPassword} onChange={event => setUserPassword(event.target.value)} />
          <button className="button" onClick={() => {checkPassword(userPassword)}}>View Post</button>
        </form>
      </div>
    }
  </Layout>
  )
}