import mongooseInstance, { Schema, Model, Types } from "mongoose";

export interface IContentField {
  key: string;
  value: unknown;
  type:
    | "text"
    | "richtext"
    | "image"
    | "gallery"
    | "date"
    | "number"
    | "boolean"
    | "select";
}

export interface IContent {
  contentType: string;
  title: string;
  slug: string;
  description?: string;
  fields: IContentField[];
  status: "draft" | "published";
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    author?: string;
    featuredImage?: string;
  };
  media: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ContentFieldSchema = new Schema<IContentField>(
  {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "text",
        "richtext",
        "image",
        "gallery",
        "date",
        "number",
        "boolean",
        "select",
      ],
      required: true,
    },
  },
  { _id: false }
);

const ContentSchema = new Schema<IContent>(
  {
    contentType: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
    },
    fields: {
      type: [ContentFieldSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    metadata: {
      seoTitle: String,
      seoDescription: String,
      seoKeywords: [String],
      author: String,
      featuredImage: String,
    },
    media: [
      {
        type: Schema.Types.ObjectId,
        ref: "Media",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
ContentSchema.index({ contentType: 1, status: 1 });
ContentSchema.index({ contentType: 1, slug: 1 });

const Content: Model<IContent> =
  mongooseInstance.models.Content ||
  mongooseInstance.model<IContent>("Content", ContentSchema);

export default Content;
