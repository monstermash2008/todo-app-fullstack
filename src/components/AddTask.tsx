import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function AddTask({
  onAddTask,
}: {
  onAddTask: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        className="mb-2"
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button className="min-w-40" type="submit" disabled={!text.trim()}>
        Add
      </Button>
    </form>
  );
}
