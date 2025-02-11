import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { NotificationBell } from "@/components/NotificationBell";
import { useQuery } from "@tanstack/react-query";
import type { Task } from "@shared/schema";

export default function Home() {
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8 bg-white rounded-lg p-4 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Priority Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your tasks efficiently</p>
          </div>
          <NotificationBell tasks={tasks} />
        </header>

        <div className="space-y-6">
          <TaskForm />
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
}