import express from "express";
import { connectDB } from "./databaseCon";
require("./models/project");
require("./models/story");
require("./models/user");
require("./models/task");

const projectRouter = require("./routes/project");
const storyRouter = require("./routes/story");
const userRouter = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    app.use("/ManageMeDB/project", projectRouter);
    app.use("/ManageMeDB/story", storyRouter);
    app.use("/ManageMeDB/user", userRouter);
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
