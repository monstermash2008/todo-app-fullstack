import { useState } from "react";
import { Task } from "../types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask,
}: {
  tasks: Task[];
  onChangeTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li className="mb-2" key={task.id}>
          <TaskComponent
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function TaskComponent({
  task,
  onChange,
  onDelete,
}: {
  task: Task;
  onChange: (task: Task) => void;
  onDelete: (taskId: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <Input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <Button onClick={() => setIsEditing(false)}>Save</Button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
      </>
    );
  }
  return (
    <Label className="flex items-center gap-x-4">
      <Checkbox
        checked={task.done}
        onCheckedChange={(checked) => {
          onChange({
            ...task,
            done: checked === true,
          });
        }}
      />
      {taskContent}
      <Button variant="destructive" onClick={() => onDelete(task.id)}>Delete</Button>
    </Label>
  );
}
