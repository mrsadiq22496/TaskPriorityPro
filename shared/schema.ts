import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  priority: integer("priority").notNull(), // 1: Low, 2: Medium, 3: High
  dueDate: timestamp("due_date").notNull(),
  dueTime: text("due_time").notNull(), // Store time as HH:mm format
  completed: boolean("completed").notNull().default(false),
  notified: boolean("notified").notNull().default(false)
});

export const insertTaskSchema = createInsertSchema(tasks)
  .omit({ id: true, completed: true, notified: true })
  .extend({
    title: z.string().min(1, "Title is required").max(100),
    priority: z.number().min(1).max(3),
    dueDate: z.string().transform((str) => new Date(str)),
    dueTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
  });

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export const priorityColors = {
  1: "#FFB946", // Orange for low
  2: "#4A90E2", // Blue for medium
  3: "#FF4B4B"  // Red for high
} as const;

export const priorityLabels = {
  1: "Low",
  2: "Medium", 
  3: "High"
} as const;