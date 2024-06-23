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

interface ITaskBase extends Document {
  name: string;
  description: string;
  priority: Priority;
  storyId: IStory["_id"];
  estimatedFinishDate: Date;
  status: Status;
  createdDate: Date;
}

interface ITodoTask extends ITaskBase {}

interface IDoingTask extends ITaskBase {
  startedDate: Date;
  assigneeId: IUser["_id"];
}

interface IDoneTask extends ITaskBase {
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
});

const DoingTaskSchema: Schema = new Schema({
  startedDate: { type: Date, required: true },
  assigneeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const DoneTaskSchema: Schema = new Schema({
  startedDate: { type: Date, required: true },
  finishedDate: { type: Date, required: true },
  assigneeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const TodoTask = mongoose.model<ITodoTask>("TodoTask", TaskSchema);
const DoingTask = mongoose.model<IDoingTask>("DoingTask", DoingTaskSchema);
const DoneTask = mongoose.model<IDoneTask>("DoneTask", DoneTaskSchema);

export { TodoTask, DoingTask, DoneTask };
