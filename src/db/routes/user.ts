import { Request, Response } from "express";
import { User } from "../models/user";
const express = require("express");
const router = express.Router();

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
