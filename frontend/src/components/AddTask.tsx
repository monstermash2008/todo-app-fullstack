import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useTasksDispatch } from '../contexts/tasksContexts'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem } from './ui/form'
import { Input } from './ui/input'

const formSchema = z.object({
  task: z.string().min(1, 'Task cannot be empty'),
})

export default function AddTask() {
  const dispatch = useTasksDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Send the new task to the backend
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: values.task,
          done: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      // Fetch the updated task list
      const tasksResponse = await fetch('/api/tasks')
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json()
        dispatch({ type: 'set', tasks: tasksData.tasks })
      }

      form.reset()
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task')
      console.error('Error adding task:', err)
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="mb-2"
                    placeholder="Add task"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            className="min-w-40"
            type="submit"
            disabled={!form.formState.isValid || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
