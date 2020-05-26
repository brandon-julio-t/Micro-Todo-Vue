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
      statusCode: 401,
      body: 'Unauthorized'
    }
  }

  console.log('identity: ', identity)
  console.log('user: ', user)

  try {
    const indexName = 'all_user_todos'
    const userId = user.sub

    const response = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index(indexName), userId)),
        q.Lambda('todo', q.Get(q.Var('todo')))
      )
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
