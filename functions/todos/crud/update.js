const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

exports.handler = async (event, context) => {
  try {
    const todoData = JSON.parse(event.body)
    const collectionName = 'todos'

    const response = await client.query(
      q.Update(q.Ref(q.Collection(collectionName), todoData.id), {
        data: todoData.data
      })
    )

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
