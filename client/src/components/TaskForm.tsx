import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema, type InsertTask } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function TaskForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      priority: 2,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      const res = await apiRequest("POST", "/api/tasks", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      form.reset();
      toast({
        title: "Task created",
        description: "Your task has been added successfully."
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} 
            className="space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-indigo-100/20 border border-indigo-100/20 transition-all hover:shadow-xl hover:shadow-indigo-100/30">
        <div className="border-b border-indigo-100/20 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create Task</h2>
          <p className="text-gray-500 text-sm mt-1">Plan your priorities and set reminders</p>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title..." 
                       className="h-12 px-4 bg-white/90 border-indigo-100/30 focus:border-indigo-500 focus:ring-indigo-500/20"
                       {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Priority</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 bg-white/90 border-indigo-100/30">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Low Priority</SelectItem>
                    <SelectItem value="2">Medium Priority</SelectItem>
                    <SelectItem value="3">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Due Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    className="h-12 bg-white/90 border-indigo-100/30 focus:border-indigo-500 focus:ring-indigo-500/20" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Due Time</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    className="h-12 bg-white/90 border-indigo-100/30 focus:border-indigo-500 focus:ring-indigo-500/20" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Adding..." : "Add Task"}
        </Button>
      </form>
    </Form>
  );
}