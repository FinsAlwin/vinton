// Frontend API utilities for fetching CMS content
// These are server-side only utilities that query database directly

import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";

export async function getHomepageContent() {
  try {
    await connectDB();

    const homepage = await Content.findOne({
      contentType: "homepage",
      status: "published",
    })
      .select("-__v")
      .lean();

    return { success: true, data: homepage };
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return { success: false, data: null };
  }
}

export async function getContentByType(type: string, limit = 10) {
  try {
    await connectDB();

    const content = await Content.find({
      contentType: type,
      status: "published",
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select("-__v")
      .lean();

    return { success: true, data: content };
  } catch (error) {
    console.error(`Error fetching ${type} content:`, error);
    return { success: false, data: [] };
  }
}

export async function getServices(limit = 6) {
  return getContentByType("services", limit);
}

export async function getProjects(limit = 6) {
  return getContentByType("projects", limit);
}

export async function getTeam(limit = 12) {
  return getContentByType("team", limit);
}

export async function getTestimonials(limit = 6) {
  return getContentByType("testimonials", limit);
}

export async function getBlogs(limit = 3) {
  return getContentByType("blogs", limit);
}
