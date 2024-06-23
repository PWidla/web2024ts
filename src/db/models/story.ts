import mongoose, { Schema, Document } from "mongoose";
import { IProject } from "./project";
import { IUser } from "./user";

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

export interface IStory extends Document {
  name: string;
  description: string;
  priority: Priority;
  project: IProject["_id"];
  createdDate: Date;
  status: Status;
  owner: IUser["_id"];
}

const StorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: Object.values(Priority), required: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    createdDate: { type: Date, default: Date.now },
    status: { type: String, enum: Object.values(Status), required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { collection: "story" }
  // { timestamps: true }
);

const Story = mongoose.model<IStory>("Story", StorySchema);

export default Story;
