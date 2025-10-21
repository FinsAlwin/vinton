import { StatsCard } from "@/components/admin/ui/stats-card";
import { RecentLogs } from "@/components/admin/dashboard/recent-logs";
import { AllContentTabs } from "@/components/admin/dashboard/all-content-tabs";
import { FileText, Image as ImageIcon, Clock, TrendingUp } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";
import Media from "@/models/Media";
import ActivityLog from "@/models/ActivityLog";
// User import required to register schema for ActivityLog.populate("user")
import User from "@/models/User";
import { getNavContentTypes } from "@/lib/content-types";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  try {
    await connectDB();

    // Ensure User model is registered for ActivityLog.populate("user")
    // This forces the model to be loaded and registered with mongoose
    if (!User.modelName) {
      throw new Error("User model not loaded");
    }

    const contentTypes = getNavContentTypes();

    const [
      totalContent,
      publishedContent,
      totalMedia,
      recentLogs,
      ...recentContentByType
    ] = await Promise.all([
      Content.countDocuments(),
      Content.countDocuments({ status: "published" }),
      Media.countDocuments(),
      ActivityLog.find()
        .sort({ timestamp: -1 })
        .limit(10)
        .populate("user", "email")
        .lean(),
      // Fetch recent content for each content type
      ...contentTypes.map((ct) =>
        Content.find({ contentType: ct.name })
          .sort({ updatedAt: -1 })
          .limit(5)
          .select("title status updatedAt contentType")
          .lean()
      ),
    ]);

    // Map recent content by type
    interface ContentDocument {
      _id: { toString: () => string };
      title: string;
      status: "draft" | "published";
      updatedAt: Date;
      contentType: string;
    }

    const recentContent: Record<
      string,
      Array<{
        _id: string;
        title: string;
        status: "draft" | "published";
        updatedAt: Date;
        contentType: string;
      }>
    > = {};
    contentTypes.forEach((ct, index) => {
      recentContent[ct.name] = (
        (recentContentByType[index] as ContentDocument[]) || []
      ).map((item) => ({
        _id: item._id.toString(),
        title: item.title,
        status: item.status,
        updatedAt: item.updatedAt,
        contentType: item.contentType,
      }));
    });

    return {
      totalContent,
      publishedContent,
      totalMedia,
      drafts: totalContent - publishedContent,
      recentLogs: recentLogs.map((log) => ({
        _id: log._id.toString(),
        email: log.email || (log.user as { email?: string })?.email,
        action: log.action,
        resource: log.resource,
        timestamp: log.timestamp,
        statusCode: log.statusCode,
        ipAddress: log.ipAddress,
      })),
      recentContent,
      contentTypes,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalContent: 0,
      publishedContent: 0,
      totalMedia: 0,
      drafts: 0,
      recentLogs: [],
      recentContent: {},
      contentTypes: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold admin-text mb-2">Dashboard</h1>
        <p className="admin-text-secondary">
          Welcome back! Here&apos;s an overview of your content.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Content"
          value={stats.totalContent}
          icon={FileText}
          description="All content items"
          iconColor="blue"
        />
        <StatsCard
          title="Published"
          value={stats.publishedContent}
          icon={TrendingUp}
          description="Live content items"
          iconColor="green"
        />
        <StatsCard
          title="Media Files"
          value={stats.totalMedia}
          icon={ImageIcon}
          description="Uploaded media"
          iconColor="purple"
        />
        <StatsCard
          title="Drafts"
          value={stats.drafts}
          icon={Clock}
          description="Unpublished items"
          iconColor="orange"
        />
      </div>

      {/* Content & Activity Widgets Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Activity Logs */}
        <RecentLogs logs={stats.recentLogs} />

        {/* All Content in Tabs */}
        <AllContentTabs
          contentByType={stats.recentContent}
          contentTypes={stats.contentTypes}
        />
      </div>
    </div>
  );
}
