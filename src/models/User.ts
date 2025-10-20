import mongooseInstance, { Schema, Model } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  role: "admin" | "super-admin";
  refreshTokens: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "super-admin"],
      default: "admin",
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> =
  mongooseInstance.models.User ||
  mongooseInstance.model<IUser>("User", UserSchema);

export default User;
