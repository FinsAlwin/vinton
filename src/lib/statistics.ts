import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";

export interface SiteStatistics {
  teamCount: number;
  clientsCount: number;
  projectsCount: number;
  citiesCount: number;
}

// Server-side: Calculate statistics with caching
export const calculateStatistics = unstable_cache(
  async (): Promise<SiteStatistics> => {
    try {
      await connectDB();

      // Count team members (published only)
      const teamCount = await Content.countDocuments({
        contentType: "team",
        status: "published",
      });

      // Count clients (published only)
      const clientsCount = await Content.countDocuments({
        contentType: "clients",
        status: "published",
      });

      // Count projects (published only)
      const projectsCount = await Content.countDocuments({
        contentType: "projects",
        status: "published",
      });

      // Count unique cities from projects
      const projects = await Content.find({
        contentType: "projects",
        status: "published",
      })
        .select("fields")
        .lean();

      const cities = new Set<string>();
      projects.forEach((project) => {
        const fields = project.fields as Array<{ key: string; value: unknown }>;
        const locationField = fields.find((f) => f.key === "location");
        if (locationField && typeof locationField.value === "string") {
          cities.add(locationField.value.trim());
        }
      });

      // Also count unique cities from team members
      const teamMembers = await Content.find({
        contentType: "team",
        status: "published",
      })
        .select("fields")
        .lean();

      teamMembers.forEach((member) => {
        const fields = member.fields as Array<{ key: string; value: unknown }>;
        const locationField = fields.find((f) => f.key === "location");
        if (locationField && typeof locationField.value === "string") {
          cities.add(locationField.value.trim());
        }
      });

      return {
        teamCount,
        clientsCount,
        projectsCount,
        citiesCount: cities.size,
      };
    } catch (error) {
      console.error("Error calculating statistics:", error);
      return {
        teamCount: 0,
        clientsCount: 0,
        projectsCount: 0,
        citiesCount: 0,
      };
    }
  },
  ["site-statistics"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["statistics", "content"],
  }
);
