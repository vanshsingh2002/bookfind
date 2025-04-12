import mongoose from 'mongoose';

export type Role = "Owner" | "Seeker";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: Role;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  role: { type: String, enum: ["Owner", "Seeker"], required: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
