import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
import Project from "../models/project";

router.get("/", async (req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", getProject, (req: Request, res: Response) => {
  if (!res.locals.project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.json(res.locals.project);
});

async function getProject(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await Project.findById(req.params.id);
    res.locals.project = project;
    next();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

router.post("/", async (req: Request, res: Response) => {
  const { name, description } = req.body;

  try {
    const newProject = new Project({
      name,
      description,
    });

    await newProject.save();

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

module.exports = router;
