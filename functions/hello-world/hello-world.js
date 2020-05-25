exports.handler = async (event, context) => {
  console.log('event: ', event)
  console.log('context: ', context)

  const { identity, user } = context.clientContext

  console.log('identity: ', identity)
  console.log('user: ', user)

  try {
    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
      headers: { 'Access-Control-Allow-Origin': `${event.headers.referrer}` }
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
