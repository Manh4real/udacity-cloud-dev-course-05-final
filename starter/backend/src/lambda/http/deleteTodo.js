import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

// DB
import { deleteTodo } from '../../businessLogic/todos.mjs'
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

    const result = await deleteTodo({ todoId, userId })

    return {
      statusCode: 201,
      body: JSON.stringify(result)
    }
  })

// export function handler(event) {
//   const todoId = event.pathParameters.todoId

//   // TODO: Remove a TODO item by id
//   return undefined
// }
