module.exports = async ({ event, _, q, client }) => {
  try {
    const { id } = JSON.parse(event.body)

    const response = await client.query(
      q.Delete(q.Ref(q.Collection('todos'), id))
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
