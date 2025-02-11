import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, priorityColors, priorityLabels } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been removed successfully."
      });
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
        <p className="text-sm text-gray-500 bg-white/80 px-3 py-1 rounded-full">
          {tasks.length} tasks total
        </p>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="group transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100/20 bg-white/80 backdrop-blur-sm border-indigo-100/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox 
                  checked={task.completed}
                  onCheckedChange={(checked) => {
                    toggleMutation.mutate({ id: task.id, completed: checked as boolean });
                  }}
                  className="mt-1.5 h-5 w-5 rounded-full border-2 border-indigo-200 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`font-medium text-gray-900 truncate ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h3>
                    <Badge 
                      style={{ backgroundColor: priorityColors[task.priority as keyof typeof priorityColors] }}
                      className="text-white text-xs px-2.5 py-0.5 rounded-full transition-transform group-hover:scale-105"
                    >
                      {priorityLabels[task.priority as keyof typeof priorityLabels]}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-500">
                    Due: {format(new Date(task.dueDate), 'PPP')} at {task.dueTime}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(task.id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-dashed border-indigo-200">
            <p className="text-gray-500">No tasks yet. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}