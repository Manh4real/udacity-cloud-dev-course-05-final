import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

// Utils
import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const updatedTodo = JSON.parse(event.body)

    const result = await updateTodo({ todoId, userId }, updatedTodo)

    return {
      statusCode: 201,
      body: JSON.stringify({
        updatedTodo: result
      })
    }
  })

// export function handler(event) {
//   const todoId = event.pathParameters.todoId
//   const updatedTodo = JSON.parse(event.body)

//   // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
//   return undefined
// }
