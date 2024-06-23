import mongoose from "mongoose";
import "dotenv/config";

const DB_CONN_STRING = "mongodb://0.0.0.0:27017/";
const DB_NAME = "ManageMeDB";

const mongoUri = DB_CONN_STRING + DB_NAME;

mongoose.set("strictQuery", false);

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
