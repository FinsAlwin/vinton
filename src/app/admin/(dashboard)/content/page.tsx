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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">Select a content type to manage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentTypes.map((contentType) => (
          <Link
            key={contentType.type}
            href={`/admin/content/${contentType.type}`}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <contentType.icon
                    className={`h-8 w-8 ${contentType.color}`}
                  />
                  <div>
                    <CardTitle>{contentType.title}</CardTitle>
                    <CardDescription className="mt-1">
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
