import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express) {
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const parsed = insertTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const task = await storage.createTask(parsed.data);
    res.json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    try {
      const task = await storage.updateTask(id, req.body);
      res.json(task);
    } catch (error) {
      res.status(404).json({ error: "Task not found" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    await storage.deleteTask(id);
    res.status(204).end();
  });

  return createServer(app);
}
