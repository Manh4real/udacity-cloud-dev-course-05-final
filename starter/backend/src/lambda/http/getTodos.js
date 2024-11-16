import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

// Utils
import { getTodos } from '../../businessLogic/todos.mjs'
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
    const userId = getUserId(event)
    const todos = await getTodos(userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        items: todos
      })
    }
  })

// export function handler(event) {
//   // TODO: Get all TODO items for a current user
//   return undefined
// }
