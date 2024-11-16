import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { getAttachmentUploadUrl } from '../../fileStorage/attachmentUtils.mjs'

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

    const signedUploadUrl = await getAttachmentUploadUrl(todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: signedUploadUrl
      })
    }
  })

// export function handler(event) {
//   const todoId = event.pathParameters.todoId

//   // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
//   return undefined
// }
