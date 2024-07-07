import { Request, Response, NextFunction } from "express";
import { Story } from "../models/story";
import mongoose from "mongoose";
const express = require("express");
const router = express.Router();

// const router = express.Router();

async function getStory(req: Request, res: Response, next: NextFunction) {
  try {
    const story = await Story.findById(req.params.id).populate("project owner");
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.locals.story = story;
    next();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

router.get("/", async (req: Request, res: Response) => {
  const { projectId } = req.query;

  try {
    const query = projectId
      ? { project: new mongoose.Types.ObjectId(projectId as string) }
      : {};
    const stories = await Story.find(query).populate("project owner");
    res.json(stories);
  } catch (error: any) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", getStory, (req: Request, res: Response) => {
  res.json(res.locals.story);
});

router.post("/", async (req: Request, res: Response) => {
  const { name, description, priority, project, status, owner } = req.body;
  const existingStory = await Story.findOne({ name });

  if (existingStory) {
    return res
      .status(409)
      .json({ message: "Story with this name already exists" });
  }

  try {
    const newStory = new Story({
      name,
      description,
      priority,
      project,
      status,
      owner,
    });

    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ error: "Failed to create story" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, priority, project, status, owner } = req.body;

  try {
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { name, description, priority, project, status, owner },
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.json(updatedStory);
  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ error: "Failed to update story" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedStory = await Story.findByIdAndDelete(id);

    if (!deletedStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ error: "Failed to delete story" });
  }
});

// export default router;
module.exports = router;
