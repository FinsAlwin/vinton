import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import {
  FileText,
  Image as ImageIcon,
  Users,
  Briefcase,
  Wrench,
  FolderOpen,
  Building,
  MessageSquare,
  Home,
} from "lucide-react";
import { getNavContentTypes } from "@/lib/content-types";

// Map icon names to lucide-react components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home: Home,
  Briefcase: Briefcase,
  Wrench: Wrench,
  Users: Users,
  FolderOpen: FolderOpen,
  Building: Building,
  MessageSquare: MessageSquare,
  FileText: FileText,
  Image: ImageIcon,
};

const contentTypeRegistry = getNavContentTypes();

const contentTypes = contentTypeRegistry.map((ct, index) => ({
  type: ct.name,
  title: ct.label,
  description: ct.description,
  icon: iconMap[ct.icon] || FileText,
  color:
    index % 3 === 0
      ? "text-primary"
      : index % 3 === 1
      ? "text-[hsl(var(--success))]"
      : "text-[hsl(var(--warning))]",
}));

export default function ContentTypesPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-3xl font-bold admin-text mb-2">
          Content Management
        </h1>
        <p className="admin-text-secondary">Select a content type to manage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {contentTypes.map((contentType) => (
          <Link
            key={contentType.type}
            href={`/admin/content/${contentType.type}`}
          >
            <Card
              hover="lift"
              className="cursor-pointer h-full admin-transition"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      contentType.color === "text-primary"
                        ? "bg-blue-500/10"
                        : contentType.color === "text-[hsl(var(--success))]"
                        ? "bg-green-500/10"
                        : "bg-orange-500/10"
                    }`}
                  >
                    <contentType.icon
                      className={`h-6 w-6 ${contentType.color}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="admin-text text-lg">
                      {contentType.title}
                    </CardTitle>
                    <CardDescription className="mt-1 admin-text-muted text-sm">
                      {contentType.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
