import mongoose, { Schema, Document } from "mongoose";

enum Role {
  Admin = "Admin",
  DevOps = "DevOps",
  Developer = "Developer",
}

export interface IUser extends Document {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  loggedIn: boolean;
  role: Role;
  token: string | null;
  refreshToken: string | null;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    loggedIn: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), required: true },
    token: { type: String, default: null, required: false },
    refreshToken: { type: String, default: null, required: false },
  },
  { collection: "user" }
);

const User = mongoose.model<IUser>("User", UserSchema);

export { User, Role };
