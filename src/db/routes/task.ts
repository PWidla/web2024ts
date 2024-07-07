import { Request, Response, NextFunction } from "express";
import { Task } from "../models/task";
import mongoose from "mongoose";

const express = require("express");
const router = express.Router();

async function getTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await Task.findById(req.params.id);
    res.locals.task = task;
    next();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/id", async (req: Request, res: Response) => {
  if (!res.locals.task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(res.locals.task);
});

router.post("/", async (req: Request, res: Response) => {
  const {
    name,
    description,
    priority,
    storyId,
    estimatedFinishDate,
    status,
    createdDate,
  } = req.body;

  const existingTask = await Task.findOne({ name });

  if (existingTask) {
    console.log("exists");
    return res
      .status(409)
      .json({ message: "Task with this name already exists" });
  }

  try {
    const newTask = new Task({
      name,
      description,
      priority,
      storyId,
      estimatedFinishDate,
      status,
      createdDate,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error: any) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    priority,
    storyId,
    estimatedFinishDate,
    status,
    createdDate,
    startedDate,
    finishedDate,
    assigneeId,
  } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        name,
        description,
        priority,
        storyId,
        estimatedFinishDate,
        status,
        createdDate,
        startedDate,
        finishedDate,
        assigneeId,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
