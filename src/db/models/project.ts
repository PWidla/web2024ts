import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
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
