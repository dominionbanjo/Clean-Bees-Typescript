import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
  role: "user" | "admin";
  avatar?: string;
  avatarPublicId?: string;
  toJSON(): Omit<IUser, "password">;
}

const UserSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  avatar: { type: String },
  avatarPublicId: { type: String },
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model<IUser>("User", UserSchema);
