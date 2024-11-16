import { v4 as uuidv4 } from 'uuid'
import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const dbClient = new TodoAccess()

export function getTodos(userId) {
  return dbClient.getTodos(userId)
}

export function createTodo(newTodo, userId) {
  const todoId = uuidv4()

  const newItem = {
    ...newTodo,
    todoId: todoId,
    userId,
    createdAt: new Date().toISOString(),
    done: false
  }

  return dbClient.createTodo(newItem)
}

export function deleteTodo({ todoId, userId }) {
  return dbClient.deleteTodo({ todoId, userId })
}

export function updateTodo({ todoId, userId }, udpatedTodo) {
  return dbClient.updateTodo({ todoId, userId }, udpatedTodo)
}
