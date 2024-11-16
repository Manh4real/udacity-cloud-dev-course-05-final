import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

// Utils
import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)

    const result = await createTodo(newTodo, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: result
      })
    }
  })

// export function handler(event) {
//   const newTodo = JSON.parse(event.body)

//   // TODO: Implement creating a new TODO item
//   return undefined
// }
