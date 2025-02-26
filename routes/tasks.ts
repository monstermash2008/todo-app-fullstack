import { Hono } from "hono";
import type { Task } from "../frontend/src/types";

const fakeTasks: Task[] = [
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true },
  { id: 3, text: "Task 3", done: false },
];

export const tasksRoute = new Hono()
  .get("/", (c) => {
    return c.json({ tasks: fakeTasks });
  })
  .post("/", async (c) => {
    const task = await c.req.json();
    return c.json(task);
  });
