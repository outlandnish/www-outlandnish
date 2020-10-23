const password = process.env.APPROVE_PASSWORD

exports.handler = async (event, context) => {
  if (!json.body)
    return { statusCode: 400, body: JSON.stringify({ error: 'requires password in body' }) }
  
  try {
    let { password: userPassword } = JSON.parse(event.body)
    console.log(`approve ${userPassword} against ${password}: ${userPassword === password}`)

    if (userPassword === password)
      return { statusCode: 200, body: JSON.stringify({ approved: true })}
    else
      return { statusCode: 401, body: JSON.stringify({ approved: false  })}
  }
  catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: err })}
  }
}