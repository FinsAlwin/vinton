import { StatsCard } from "@/components/admin/ui/stats-card";
import { RecentLogs } from "@/components/admin/dashboard/recent-logs";
import { FileText, Image as ImageIcon, Clock, TrendingUp } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";
import Media from "@/models/Media";
import ActivityLog from "@/models/ActivityLog";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  try {
    await connectDB();

    const [totalContent, publishedContent, totalMedia, recentLogs] =
      await Promise.all([
        Content.countDocuments(),
        Content.countDocuments({ status: "published" }),
        Media.countDocuments(),
        ActivityLog.find()
          .sort({ timestamp: -1 })
          .limit(10)
          .populate("user", "email")
          .lean(),
      ]);

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
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalContent: 0,
      publishedContent: 0,
      totalMedia: 0,
      drafts: 0,
      recentLogs: [],
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

      {/* Recent Activity Logs */}
      <RecentLogs logs={stats.recentLogs} />
    </div>
  );
}
