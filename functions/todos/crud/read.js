const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

exports.handler = async (event, context) => {
  try {
    const { todoId } = event.queryStringParameters
    const userId = context.clientContext.user.sub

    const response = todoId ? await getOne(todoId) : await getAll(userId)

    if (todoId) {
      const todoBelongsToUser = response.data.user_id === userId
      if (!todoBelongsToUser) {
        return {
          statusCode: 401
        }
      }
    }

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

async function getOne(todoId) {
  console.log('Searching for: ', todoId)
  return await client.query(q.Get(q.Ref(q.Collection('todos'), todoId)))
}

async function getAll(userId) {
  const indexName = 'all_user_todos'

  return await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index(indexName), userId)),
      q.Lambda('todo', q.Get(q.Var('todo')))
    )
  )
}
