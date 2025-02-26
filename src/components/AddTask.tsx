import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem } from "./ui/form"
import { Input } from "./ui/input"

const formSchema = z.object({
  task: z.string().min(1, "Task cannot be empty"),
})

export default function AddTask({
  onAddTask,
}: {
  onAddTask: (text: string) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddTask(values.task)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input className="mb-2" placeholder="Add task" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button 
          className="min-w-40" 
          type="submit"
          disabled={!form.formState.isValid}
        >
          Add
        </Button>
      </form>
    </Form>
  )
}
