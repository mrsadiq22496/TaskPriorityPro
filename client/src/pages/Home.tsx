import { TaskList } from "@/components/TaskList";
import { NotificationBell } from "@/components/NotificationBell";
import { useQuery } from "@tanstack/react-query";
import type { Task } from "@shared/schema";
import { Navigation } from "@/components/Navigation";
import { useRoute } from "wouter";

export default function Home() {
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
  const [matchPriority, priorityParams] = useRoute("/priority/:priority");
  const [matchCompleted] = useRoute("/completed");

  const filteredTasks = matchCompleted
    ? tasks.filter((task) => task.completed)
    : matchPriority
    ? tasks.filter(
        (task) =>
          task.priority === parseInt(priorityParams!.priority) && !task.completed
      )
    : tasks.filter((task) => !task.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-indigo-100/20 border border-indigo-100/20">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Priority Tasks
            </h1>
            <p className="text-gray-600 text-sm mt-1">Stay organized, get more done</p>
          </div>
          <NotificationBell tasks={tasks} />
        </header>

        <Navigation />
        <TaskList tasks={filteredTasks} />
      </div>
    </div>
  );
}