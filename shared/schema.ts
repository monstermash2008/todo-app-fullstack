import { z } from 'zod'

export const taskSchema = z.object({
  id: z.number(),
  text: z.string(),
  done: z.boolean(),
})

export type Task = z.infer<typeof taskSchema>

export const createTaskSchema = taskSchema.omit({ id: true })
