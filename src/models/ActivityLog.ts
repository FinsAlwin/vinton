import mongooseInstance, { Schema, Model, Types } from "mongoose";

export interface IActivityLog {
  user?: Types.ObjectId;
  email?: string;
  action: string;
  resource: string;
  resourceId?: string;
  method: string;
  path: string;
  statusCode: number;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  duration?: number;
  timestamp: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    email: {
      type: String,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
      enum: [
        "CREATE_CONTENT",
        "UPDATE_CONTENT",
        "DELETE_CONTENT",
        "READ_CONTENT",
        "UPLOAD_MEDIA",
        "DELETE_MEDIA",
        "UPDATE_SETTINGS",
        "LOGIN_SUCCESS",
        "LOGIN_FAILED",
        "LOGOUT",
        "REGISTER_USER",
        "ERROR",
        "ACCESS_DENIED",
      ],
    },
    resource: {
      type: String,
      required: true,
      index: true,
      enum: ["content", "media", "settings", "auth", "user", "system"],
    },
    resourceId: {
      type: String,
      index: true,
    },
    method: {
      type: String,
      required: true,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
    path: {
      type: String,
      required: true,
    },
    statusCode: {
      type: Number,
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    details: {
      type: Schema.Types.Mixed,
    },
    duration: {
      type: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false, // We're using custom timestamp field
  }
);

// Compound indexes for efficient queries
ActivityLogSchema.index({ user: 1, timestamp: -1 });
ActivityLogSchema.index({ action: 1, timestamp: -1 });
ActivityLogSchema.index({ resource: 1, timestamp: -1 });
ActivityLogSchema.index({ timestamp: -1 }); // For sorting by date

// TTL index to auto-delete logs older than 90 days (optional)
// ActivityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

const ActivityLog: Model<IActivityLog> =
  mongooseInstance.models.ActivityLog ||
  mongooseInstance.model<IActivityLog>("ActivityLog", ActivityLogSchema);

export default ActivityLog;
