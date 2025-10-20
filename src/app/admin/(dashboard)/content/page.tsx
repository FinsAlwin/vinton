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
  Newspaper,
  Briefcase,
  Wrench,
} from "lucide-react";

const contentTypes = [
  {
    type: "blogs",
    title: "Blogs",
    description: "Manage blog posts and articles",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    type: "news",
    title: "News",
    description: "Company news and updates",
    icon: Newspaper,
    color: "text-green-500",
  },
  {
    type: "portfolio",
    title: "Portfolio",
    description: "Project showcase and case studies",
    icon: ImageIcon,
    color: "text-purple-500",
  },
  {
    type: "team",
    title: "Team Members",
    description: "Team profiles and information",
    icon: Users,
    color: "text-orange-500",
  },
  {
    type: "services",
    title: "Services",
    description: "Service offerings and details",
    icon: Wrench,
    color: "text-cyan-500",
  },
  {
    type: "company",
    title: "Company Info",
    description: "About and company information",
    icon: Briefcase,
    color: "text-indigo-500",
  },
];

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
