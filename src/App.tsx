import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import { TasksProvider } from "./contexts/TasksProvider";

function App() {
  return (
    <TasksProvider>
      <div className="p-4 w-full max-w-xl mx-auto flex flex-col gap-4">
        <h1 className="text-3xl font-bold mb-8">Day off in Kyoto</h1>
        <AddTask />
        <TaskList />
      </div>
    </TasksProvider>
  );
}

export default App;
