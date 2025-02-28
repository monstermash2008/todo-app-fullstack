import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem } from './ui/form'
import { Input } from './ui/input'

const formSchema = z.object({
  task: z.string().min(1, 'Task cannot be empty'),
})

export default function AddTask() {
  const queryClient = useQueryClient()

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Send the new task to the backend
      await addTask.mutateAsync(values.task)
      // Clear the form after successful submission
      form.reset()
    }
    catch (err) {
      console.error('Error adding task:', err)
    }
  }

  return (
    <div>
      {addTask.error && <p className="text-red-500 text-sm mb-2">{addTask.error.message}</p>}
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
                    disabled={addTask.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            className="min-w-40"
            type="submit"
            disabled={!form.formState.isValid || addTask.isPending}
          >
            {addTask.isPending ? 'Adding...' : 'Add'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
