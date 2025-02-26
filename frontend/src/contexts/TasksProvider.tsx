import { useReducer } from 'react'
import { TasksContext, TasksDispatchContext } from './tasksContexts'
import { initialTasks, tasksReducer } from './tasksReducer'

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  )
}
