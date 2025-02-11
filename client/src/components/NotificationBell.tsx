import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Task } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { isAfter, isBefore, addHours, parse, format } from "date-fns";

interface NotificationBellProps {
  tasks: Task[];
}

export function NotificationBell({ tasks }: NotificationBellProps) {
  const upcomingTasks = tasks.filter(task => {
    const dueDateTime = new Date(task.dueDate);
    const [hours, minutes] = task.dueTime.split(':');
    dueDateTime.setHours(parseInt(hours), parseInt(minutes));

    const now = new Date();
    return (
      !task.completed &&
      task.priority === 3 && // High priority only
      isAfter(dueDateTime, now) &&
      isBefore(dueDateTime, addHours(now, 24))
    );
  });

  const count = upcomingTasks.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-6 w-6 text-gray-600" />
          {count > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 animate-pulse"
            >
              {count}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-500" />
            <h4 className="font-semibold text-gray-900">Upcoming High Priority Tasks</h4>
          </div>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-2">
              {upcomingTasks.map(task => (
                <div key={task.id} className="text-sm p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
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