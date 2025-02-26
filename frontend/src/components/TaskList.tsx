import type { Task } from '../types'
import { useTasks, useTasksDispatch } from '@/contexts/tasksContexts'
import { useState } from 'react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function TaskList() {
  const tasks = useTasks()

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
  const dispatch = useTasksDispatch()

  let taskContent
  if (isEditing) {
    taskContent = (
      <>
        <Input
          value={task.text}
          onChange={(e) => {
            dispatch({
              type: 'changed',
              task: { ...task, text: e.target.value },
            })
          }}
        />
        <Button onClick={() => setIsEditing(false)}>Save</Button>
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
        onCheckedChange={(checked) => {
          dispatch({
            type: 'changed',
            task: { ...task, done: checked === true },
          })
        }}
      />
      {taskContent}
      <Button
        variant="destructive"
        onClick={() => {
          dispatch({
            type: 'deleted',
            id: task.id,
          })
        }}
      >
        Delete
      </Button>
    </Label>
  )
}
