import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function AddTask({
  onAddTask,
}: {
  onAddTask: (text: string) => void;
}) {
  const [text, setText] = useState("");
  return (
    <div className="flex gap-2">
      <Input
        className="mb-2"
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
      className="min-w-40"
        onClick={() => {
          setText("");
          onAddTask(text);
        }}
      >
        Add
      </Button>
    </div>
  );
}
