"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/admin/ui/alert";
import { useToast } from "@/components/admin/ui/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage application settings and configuration
        </p>
      </div>

      <Alert variant="info">
        <div>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>
            Settings management interface is not yet implemented.
          </AlertDescription>
        </div>
      </Alert>

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
          <button
            className="mt-4 inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-accent"
            onClick={() =>
              toast({
                title: "Saved",
                description: "Settings saved successfully.",
                variant: "success",
              })
            }
          >
            Fake save — show toast
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
