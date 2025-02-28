import { useEffect, useReducer } from 'react'
import { TasksContext, TasksDispatchContext } from './tasksContexts'
import { tasksReducer } from './tasksReducer'

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useReducer(tasksReducer, [])

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks')
        const json = await response.json()
        dispatch({ type: 'set', tasks: json.tasks })
      }
      catch (error) {
        console.error('Failed to fetch tasks:', error)
      }
    }

    fetchTasks()
  }, [])

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  )
}
