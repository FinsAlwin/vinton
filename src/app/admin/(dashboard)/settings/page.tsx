import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage application settings and configuration
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Configuration options for the application
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Settings management interface coming soon. You can extend this to
            add site-wide configuration options, API keys, email settings, and
            more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
