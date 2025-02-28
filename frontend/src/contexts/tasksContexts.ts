import type { Task } from '../../../shared/schema'
import type { TaskAction } from './tasksReducer'
import { createContext, useContext } from 'react'

export const TasksContext = createContext<Task[]>([])
export const TasksDispatchContext = createContext<
  React.ActionDispatch<[action: TaskAction]>
>(() => {
  throw new Error('TasksDispatchContext not provided')
})

export function useTasks() {
  return useContext(TasksContext)
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext)
}
