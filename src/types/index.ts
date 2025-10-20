export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  _id: string;
  email: string;
  role: "admin" | "super-admin";
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface ContentField {
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

export interface Content {
  _id: string;
  contentType: string;
  title: string;
  slug: string;
  description?: string;
  fields: ContentField[];
  status: "draft" | "published";
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    author?: string;
    featuredImage?: string;
  };
  media: string[]; // Array of Media IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Media {
  _id: string;
  filename: string;
  originalName: string;
  s3Key: string;
  url: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  uploadedBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  _id: string;
  key: string;
  value: unknown;
  category?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ContentFilters extends PaginationParams {
  status?: "draft" | "published";
  author?: string;
}
