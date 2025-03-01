import type { Task } from '../../../shared/schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useTasks() {
  const queryClient = useQueryClient()

  const { data: tasks = [], error } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks')
      if (!response.ok)
        throw new Error('Failed to fetch tasks')
      const data = await response.json()
      return data.tasks
    },
  })

  const addTask = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          done: false,
        }),
      })
      if (!response.ok)
        throw new Error('Failed to add task')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch tasks after successful mutation
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const updateTask = useMutation({
    mutationFn: async (task: Task) => {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })
      if (!response.ok)
        throw new Error('Failed to update task')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok)
        throw new Error('Failed to delete task')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return {
    tasks,
    error,
    addTask,
    updateTask,
    deleteTask,
  }
}
