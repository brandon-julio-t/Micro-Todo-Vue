const faunadb = require('faunadb')

const createTodo = require('./crud/create')
const deleteTodo = require('./crud/delete')
const readTodo = require('./crud/read')
const updateTodo = require('./crud/update')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

const methodAndHandlerModuleDictionary = {
  DELETE: deleteTodo,
  GET: readTodo,
  POST: createTodo,
  PUT: updateTodo
}

exports.handler = async (event, context) => {
  try {
    console.log('event: ', event)
    console.log('context: ', context)

    const { user } = context.clientContext
    if (!user) {
      return { statusCode: 401, body: 'Unauthorized' }
    }

    const { httpMethod } = event
    const handlerModule = methodAndHandlerModuleDictionary[httpMethod]
    if (!handlerModule) {
      return { statusCode: 405, body: 'Method not Allowed' }
    }

    const response = await handlerModule({ event, context, q, client })

    console.log('response: ', response)

    return response
  } catch (e) {
    console.log('error: ', e)

    return {
      statusCode: 400,
      body: JSON.stringify(e)
    }
  }
}
