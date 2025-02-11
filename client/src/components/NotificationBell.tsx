import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Task } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { isAfter, isBefore, addHours, format } from "date-fns";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface NotificationBellProps {
  tasks: Task[];
}

export function NotificationBell({ tasks }: NotificationBellProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notifiedIds, setNotifiedIds] = useState<number[]>([]);

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, { notified: true });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  });

  const upcomingTasks = tasks.filter(task => {
    if (task.completed || task.priority !== 3 || task.notified || notifiedIds.includes(task.id)) {
      return false;
    }

    const dueDateTime = new Date(task.dueDate);
    const [hours, minutes] = task.dueTime.split(':');
    dueDateTime.setHours(parseInt(hours), parseInt(minutes));

    const now = new Date();
    const isUpcoming = isAfter(dueDateTime, now) && 
                      isBefore(dueDateTime, addHours(now, 24));

    return isUpcoming;
  });

  // Check for new notifications every minute
  useEffect(() => {
    const checkNotifications = () => {
      upcomingTasks.forEach(task => {
        if (!notifiedIds.includes(task.id)) {
          toast({
            title: "Upcoming High Priority Task",
            description: `"${task.title}" is due at ${task.dueTime}`,
            duration: 5000,
          });

          // Update both local state and server state
          setNotifiedIds(prev => [...prev, task.id]);
          updateTaskMutation.mutate({ id: task.id });
        }
      });
    };

    // Initial check
    checkNotifications();

    // Set up interval for periodic checks
    const interval = setInterval(checkNotifications, 30000); // Check every 30 seconds for demo purposes
    return () => clearInterval(interval);
  }, [tasks, notifiedIds, toast, updateTaskMutation]);

  const count = upcomingTasks.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2.5 rounded-full hover:bg-indigo-100/50 transition-all duration-300">
          <Bell className="h-6 w-6 text-indigo-600" />
          {count > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 animate-pulse"
            >
              {count}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-white/95 backdrop-blur-sm border-indigo-100/20 shadow-xl shadow-indigo-100/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-500" />
            <h4 className="font-semibold text-gray-900">Upcoming High Priority Tasks</h4>
          </div>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-2">
              {upcomingTasks.map(task => (
                <div key={task.id} className="text-sm p-3 bg-red-50/50 rounded-xl hover:bg-red-50 transition-all duration-300">
                  <div className="font-medium text-gray-900">{task.title}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    Due: {format(new Date(task.dueDate), 'PPP')} at {task.dueTime}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-2">
              No upcoming high priority tasks
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}