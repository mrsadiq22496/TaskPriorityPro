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
    <div className="min-h-screen bg-[#F8F9FA] text-[#333333] font-inter">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Priority Tasks</h1>
          <NotificationBell tasks={tasks} />
        </div>
        
        <div className="grid gap-8">
          <TaskForm />
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
