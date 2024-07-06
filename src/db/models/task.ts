import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";
import { IStory } from "./story";

enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

enum Status {
  ToDo = "ToDo",
  Doing = "Doing",
  Done = "Done",
}

interface ITask extends Document {
  name: string;
  description: string;
  priority: Priority;
  storyId: IStory["_id"];
  estimatedFinishDate: Date;
  status: Status;
  createdDate: Date;
  startedDate: Date;
  finishedDate: Date;
  assigneeId: IUser["_id"];
}

const TaskSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  priority: { type: String, enum: Object.values(Priority), required: true },
  storyId: { type: Schema.Types.ObjectId, ref: "Story", required: true },
  estimatedFinishDate: { type: Date, required: true },
  status: { type: String, enum: Object.values(Status), required: true },
  createdDate: { type: Date, default: Date.now },
  startedDate: { type: Date, required: false },
  finishedDate: { type: Date, required: false },
  assigneeId: { type: Schema.Types.ObjectId, ref: "User", required: false },
});

const Task = mongoose.model<ITask>("TodoTask", TaskSchema);

export { Task };
