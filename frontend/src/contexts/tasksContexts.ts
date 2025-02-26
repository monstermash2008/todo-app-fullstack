import { Task } from "@/types";
import { createContext, useContext } from "react";
import { TaskAction } from "./tasksReducer";

export const TasksContext = createContext<Task[]>([]);
export const TasksDispatchContext = createContext<
  React.ActionDispatch<[action: TaskAction]>
>(() => {
  throw new Error("TasksDispatchContext not provided");
});

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
