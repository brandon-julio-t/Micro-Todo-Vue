const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = async (event, context) => {
  console.log('event: ', event)
  console.log('context: ', context)

  const { identity, user } = context.clientContext

  if (!user) {
    return {
      statusCode: 401
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      Allow: ['POST']
    }
  }

  console.log('identity: ', identity)
  console.log('user: ', user)

  try {
    const todoData = JSON.parse(event.body)
    const collectionName = 'todos'

    const response = await client.query(
      q.Create(q.Collection(collectionName), {
        data: todoData
      })
    )

    console.log('response: ', response)

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    }
  } catch (e) {
    console.log('error: ', e)

    return {
      statusCode: 400,
      body: JSON.stringify(e)
    }
  }
}
