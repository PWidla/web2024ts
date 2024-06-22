import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IProject extends Document {
  //_id: ObjectId;
  name: string;
  description: string;
}

const ProjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { collection: "project" }
);

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
