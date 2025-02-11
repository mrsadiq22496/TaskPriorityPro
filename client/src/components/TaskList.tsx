import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, priorityColors, priorityLabels } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
      {tasks.map((task) => (
        <Card key={task.id} className="relative">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Checkbox 
                checked={task.completed}
                onCheckedChange={(checked) => {
                  toggleMutation.mutate({ id: task.id, completed: checked as boolean });
                }}
              />

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  <Badge 
                    style={{ backgroundColor: priorityColors[task.priority as keyof typeof priorityColors] }}
                    className="text-white"
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
                className="text-gray-500 hover:text-red-500"
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tasks yet. Add one above!
        </div>
      )}
    </div>
  );
}