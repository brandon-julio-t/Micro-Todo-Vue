exports.handler = async (event, context) => {
  console.log('event: ', event)
  console.log('context: ', context)
  try {
    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
      headers: { 'Access-Control-Allow-Origin': `*` }
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
