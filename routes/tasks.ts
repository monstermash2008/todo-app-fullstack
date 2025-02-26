import type { Task } from '../frontend/src/types'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'
import { z } from 'zod'

const fakeTasks: Task[] = [
  { id: 1, text: 'Task 1', done: false },
  { id: 2, text: 'Task 2', done: true },
  { id: 3, text: 'Task 3', done: false },
]

const createTaskSchema = z.object({
  text: z.string(),
  done: z.boolean(),
})

export const tasksRoute = new Hono()
  .get('/', describeRoute({
    description: 'Get all tasks',
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': { schema: resolver(createTaskSchema) },
        },
      },
    },
  }), (c) => {
    return c.json({ tasks: fakeTasks })
  })
  .post('/', zValidator('json', createTaskSchema), describeRoute({
    description: 'Create a new task',
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': { schema: resolver(createTaskSchema) },
        },
      },
    },
  }), async (c) => {
    const task = await c.req.valid('json')
    fakeTasks.push({ ...task, id: fakeTasks.length + 1 })
    return c.json(task)
  })
