import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client()
const attachmentsBucketName = process.env.TODOS_ATTACHMENTS_BUCKET
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION || 6000

export async function getAttachmentUploadUrl(attachmentId) {
  const command = new PutObjectCommand({
    Bucket: attachmentsBucketName,
    Key: attachmentId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: signedUrlExpiration
  })

  return url
}
