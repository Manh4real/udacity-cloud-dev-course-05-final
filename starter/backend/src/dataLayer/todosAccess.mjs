import { v4 as uuidv4 } from 'uuid'

// DynamoDB
import {
  DeleteCommand,
  DynamoDBDocument,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

// S3
import { PutObjectCommand } from '@aws-sdk/client-s3'

export class TodoAccess {
  constructor(
    dbDocumentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE_NAME
  ) {
    this.dbDocumentClient = dbDocumentClient
    this.todosTable = todosTable
    this.todosCreateAtIndexName = process.env.TODOS_CREATED_AT_INDEX
    this.dbClient = DynamoDBDocument.from(this.dbDocumentClient)
  }

  async getTodos(userId) {
    try {
      const command = new QueryCommand({
        TableName: this.todosTable,
        IndexName: this.todosCreateAtIndexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })

      const result = await this.dbClient.send(command)

      console.log('todos', result)
      return result.Items || []
    } catch (err) {
      console.log('getTodos', err)
    }

    return []
  }

  async createTodo(newTodo) {
    const command = new PutCommand({
      TableName: this.todosTable,
      Item: newTodo
    })

    await this.dbClient.send(command)

    return newTodo
  }

  async updateTodo({ todoId, userId }, updatedTodo) {
    const updateExpression =
      'set ' +
      Object.keys(updatedTodo)
        .map((key) => `#${key} = :${key}`)
        .join(', ')
    const expressionAttrValues = Object.keys(updatedTodo).reduce((acc, key) => {
      acc[`:${key}`] = updatedTodo[key]

      return acc
    }, {})
    const expressionAttrNames = Object.keys(updatedTodo).reduce((acc, key) => {
      acc[`#${key}`] = key

      return acc
    }, {})

    const command = new UpdateCommand({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttrValues,
      ExpressionAttributeNames: expressionAttrNames
    })

    const result = await this.dbClient.send(command)

    return updatedTodo
  }

  async deleteTodo({ todoId, userId }) {
    const command = new DeleteCommand({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      }
    })

    await this.dbClient.send(command)

    return true
  }

  //   async doesTodoExists(todoId) {
  //     const result = await this.dbClient.get({
  //       TableName: groupsTable,
  //       Key: {
  //         todoId: todoId
  //       }
  //     })

  //     console.log('doesTodoExists: ', result)
  //     return !!result.Item
  //   }
}
