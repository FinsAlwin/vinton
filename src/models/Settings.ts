import mongooseInstance, { Schema, Model } from "mongoose";

export interface ISettings {
  key: string;
  value: unknown;
  category?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      index: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> =
  mongooseInstance.models.Settings ||
  mongooseInstance.model<ISettings>("Settings", SettingsSchema);

export default Settings;
