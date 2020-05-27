const methodAndModuleDictionary = {
  DELETE: 'delete',
  GET: 'read',
  POST: 'create',
  PUT: 'update'
}

exports.handler = async (event, context) => {
  try {
    console.log('event: ', event)
    console.log('context: ', context)

    if (!context.clientContext.user) {
      return {
        statusCode: 401
      }
    }

    const moduleNameByHttpMethod = methodAndModuleDictionary[event.httpMethod]
    if (!moduleNameByHttpMethod) {
      return {
        statusCode: 405
      }
    }

    const moduleName = `./crud/${moduleNameByHttpMethod}`

    console.log('module name: ', moduleName)

    const response = await require(moduleName).handler(event, context)

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
