import type { Task } from '../../../shared/schema'
import { useTasks } from '@/hooks/useTasks'
import { useState } from 'react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function TaskList() {
  const { tasks, error } = useTasks()

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
  const { updateTask, deleteTask } = useTasks()

  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(task.text)

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
