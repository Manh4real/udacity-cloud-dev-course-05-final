import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJYfxtZizx4PqOMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi0xa2NidDB5Y2szOGk3anBtLnVzLmF1dGgwLmNvbTAeFw0yNDExMTEx
NTEwMDZaFw0zODA3MjExNTEwMDZaMCwxKjAoBgNVBAMTIWRldi0xa2NidDB5Y2sz
OGk3anBtLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAKaAbFV87j7fEp/ePZFSd7q4/52BzAHAQrMj/LgehJGXbwK9Xib1AmYjnlxA
vviLB+H/zG5SRcw0xlNmbj2jsz5ZSuxvDtQauSQ80MojVCu9c63vCPBwpaLcAJEN
dOAF7uZhdvksjx4ePqzknuiDm8hbGaONLUBbidYyjUAk+y0HaCfx3ttwPdP1g60L
EUvTNI9MQgYoOkeN6EOh0ceZAUBdsojlVG4FcdMg4kr2X0wepcOne3S6vm5pMjSy
71Nd9rth9pTL/CjQKw3qFOTES/NiY0ZfPWKzfbvNIKL/7Mp65N1wFM/21cjVjFP9
VBKHPkUaRX2BKtK9c7UQHrSvTPkCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUiGChmTVF7QdgC3hWoHFq9p8pFo0wDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQAwH6kr5eLy5y7fVTwH6JUleqgfqrRythu7hSiy58aH
UzfhS4xR5P288wYRYfS6S56kHhrK3O8MLMOc9PGbgZTY1Ue9F97diSwBGO/zKhXa
VoYADgFtyYG+EtRXKGuam9cyUJEPmqsNew1UchKxvKMY/4ijBoU/vxbiwyh7rpny
AWxp2WQaKdb1ylfWZgwS/gi8tS9k6gugxEidFWRMXixC48he+Vn5chLVL6ZV97qi
hvkyz9dg6Kig6PXnVPlz+AEG6HOCo2RmE9l2WIkUyVUzoLaz1OJvXNITGgEsl6EM
TwCw5iQHbTE4tuiLC8FGJiHRvYA+Wf/Aw+gpDCLimeRh
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    console.log('jwtToken', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  // const jwt = jsonwebtoken.decode(token, { complete: true })

  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
