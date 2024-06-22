import express from "express";
import { connectDB } from "./databaseCon";
const projectRouter = require("./routes/project");

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
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
