import { Hono } from "hono";
import { logger } from "hono/logger";
import { tasksRoute } from "./routes/tasks";

const app = new Hono();

app.use("*", logger());

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});

app.route("/api/tasks", tasksRoute);

export default app;
