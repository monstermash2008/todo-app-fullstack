import { useReducer } from "react";
import { TasksContext, TasksDispatchContext } from "./tasksContexts";
import { initialTasks, tasksReducer } from "./tasksReducer";

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
