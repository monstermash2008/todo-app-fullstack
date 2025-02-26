import { TaskAction } from "@/App";
import { Task } from "@/types";
import { createContext } from "react";

export const TasksContext = createContext<Task[]>([]);
export const TasksDispatchContext = createContext<
  React.ActionDispatch<[action: TaskAction]>
>(() => {
  throw new Error("TasksDispatchContext not provided");
});
