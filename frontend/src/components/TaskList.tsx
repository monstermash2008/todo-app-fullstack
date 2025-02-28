import type { Task } from '../../../shared/schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function TaskList() {
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

  if (error) {
    return (
      <p>
        Error fetching tasks:
        {error.message}
      </p>
    )
  }

  return (
    <ul>
      {tasks.map(task => (
        <li className="mb-2" key={task.id}>
          <TaskComponent task={task} />
        </li>
      ))}
    </ul>
  )
}

function TaskComponent({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(task.text)

  const queryClient = useQueryClient()

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

  const handleSave = async () => {
    try {
      await updateTask.mutateAsync({
        ...task,
        text: editedText,
      })
      setIsEditing(false)
    }
    catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleToggleDone = async () => {
    try {
      await updateTask.mutateAsync({
        ...task,
        done: !task.done,
      })
    }
    catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(task.id)
    }
    catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  let taskContent
  if (isEditing) {
    taskContent = (
      <>
        <Input
          value={editedText}
          onChange={(e) => { setEditedText(e.target.value) }}
          disabled={updateTask.isPending}
        />
        <Button onClick={handleSave} disabled={updateTask.isPending}>
          {updateTask.isPending ? 'Saving...' : 'Save'}
        </Button>
      </>
    )
  }
  else {
    taskContent = (
      <>
        {task.text}
        <Button variant="secondary" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      </>
    )
  }
  return (
    <Label className="flex items-center gap-x-4">
      <Checkbox
        checked={task.done}
        onCheckedChange={handleToggleDone}
        disabled={updateTask.isPending}
      />
      {taskContent}
      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={updateTask.isPending}
      >
        Delete
      </Button>
    </Label>
  )
}
