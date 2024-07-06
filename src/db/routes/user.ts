import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
const express = require("express");
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", getUser, (req: Request, res: Response) => {
  if (!res.locals.user) {
    return res.status(404).json({ message: " User not found" });
  }
  res.json(res.locals.user);
});

async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    res.locals.user = user;
    next();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

router.post("/", async (req: Request, res: Response) => {
  const { username, password, firstName, lastName, loggedIn, role } = req.body;
  console.log("user post");
  try {
    const newUser = new User({
      username,
      password,
      firstName,
      lastName,
      loggedIn,
      role,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedFields = req.body;
  console.log("user put");
  console.log(updatedFields);
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

module.exports = router;
