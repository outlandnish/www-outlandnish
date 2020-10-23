const password = process.env.APPROVE_PASSWORD

exports.handler = (event, context) => {
  let { password: userPassword } = JSON.parse(event.body)
  console.log(`approve ${userPassword} against ${password}: ${userPassword === password}`)

  if (userPassword === password)
    return { statusCode: 200, body: JSON.stringify({ approved: true })}
  else
    return { statusCode: 401, body: JSON.stringify({ approved: false })}
}