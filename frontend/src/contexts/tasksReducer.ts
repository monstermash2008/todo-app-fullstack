import type { Task } from '../../../shared/schema'

export type TaskAction =
  | { type: 'added', id: number, text: string }
  | { type: 'changed', task: Task }
  | { type: 'deleted', id: number }
  | { type: 'set', tasks: Task[] }

export function tasksReducer(tasks: Task[], action: TaskAction) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ]
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task
        }
        else {
          return t
        }
      })
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id)
    }
    case 'set': {
      return action.tasks
    }
    default: {
      throw new Error('Unknown action')
    }
  }
}
