import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import {
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  Clock,
} from "lucide-react";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";
import Media from "@/models/Media";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  try {
    await connectDB();

    const [totalContent, publishedContent, totalMedia, recentContent] =
      await Promise.all([
        Content.countDocuments(),
        Content.countDocuments({ status: "published" }),
        Media.countDocuments(),
        Content.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("title contentType status createdAt")
          .lean(),
      ]);

    return {
      totalContent,
      publishedContent,
      totalMedia,
      recentContent: recentContent.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalContent: 0,
      publishedContent: 0,
      totalMedia: 0,
      recentContent: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Vinton admin panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContent}</div>
            <p className="text-xs text-muted-foreground">All content items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedContent}</div>
            <p className="text-xs text-muted-foreground">Live content items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Files</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMedia}</div>
            <p className="text-xs text-muted-foreground">Uploaded media</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalContent - stats.publishedContent}
            </div>
            <p className="text-xs text-muted-foreground">Unpublished items</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentContent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No content yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recentContent.map(
                (item: {
                  _id: string;
                  title: string;
                  contentType: string;
                  status: string;
                  createdAt: string | Date;
                }) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.contentType} •{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        item.status === "published"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
