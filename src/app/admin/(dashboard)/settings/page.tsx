"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { Switch } from "@/components/admin/ui/switch";
import { useToast } from "@/components/admin/ui/use-toast";
import { MediaPicker } from "@/components/admin/ui/media-picker";
import { Save } from "lucide-react";
import Image from "next/image";

interface MediaItem {
  _id: string;
  url: string;
  originalName: string;
  mimeType: string;
}

interface SettingField {
  key: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "password"
    | "textarea"
    | "toggle"
    | "image";
  category: string;
  placeholder?: string;
  description?: string;
}

const settingsConfig: SettingField[] = [
  // General Settings
  {
    key: "site_name",
    label: "Site Name",
    type: "text",
    category: "general",
    placeholder: "My Awesome Website",
    description: "The name of your website",
  },
  {
    key: "site_tagline",
    label: "Site Tagline",
    type: "text",
    category: "general",
    placeholder: "Your site's tagline",
    description: "A short description of your website",
  },
  {
    key: "site_logo",
    label: "Site Logo",
    type: "image",
    category: "general",
    description: "Your website logo",
  },
  {
    key: "site_favicon",
    label: "Favicon",
    type: "image",
    category: "general",
    description: "Website favicon (appears in browser tab)",
  },
  {
    key: "contact_email",
    label: "Contact Email",
    type: "email",
    category: "general",
    placeholder: "contact@example.com",
    description: "Primary contact email address",
  },
  {
    key: "contact_phone",
    label: "Contact Phone",
    type: "text",
    category: "general",
    placeholder: "+1 (555) 123-4567",
    description: "Contact phone number",
  },
  {
    key: "contact_address",
    label: "Address",
    type: "textarea",
    category: "general",
    placeholder: "123 Main St, City, Country",
    description: "Physical address or location",
  },
  {
    key: "maintenance_mode",
    label: "Maintenance Mode",
    type: "toggle",
    category: "general",
    description: "Enable to show maintenance page to visitors",
  },

  // SEO Defaults
  {
    key: "seo_default_title",
    label: "Default Meta Title",
    type: "text",
    category: "seo",
    placeholder: "My Website - Tagline",
    description: "Default title for pages without specific SEO title",
  },
  {
    key: "seo_default_description",
    label: "Default Meta Description",
    type: "textarea",
    category: "seo",
    placeholder: "A brief description of your website...",
    description: "Default description for search engines",
  },
  {
    key: "seo_default_keywords",
    label: "Default Meta Keywords",
    type: "text",
    category: "seo",
    placeholder: "keyword1, keyword2, keyword3",
    description: "Comma-separated keywords",
  },
  {
    key: "seo_default_og_image",
    label: "Default OG Image",
    type: "image",
    category: "seo",
    description: "Default image for social media sharing",
  },
  {
    key: "seo_google_analytics_id",
    label: "Google Analytics ID",
    type: "text",
    category: "seo",
    placeholder: "G-XXXXXXXXXX",
    description: "Google Analytics tracking ID",
  },
  {
    key: "seo_google_search_console",
    label: "Google Search Console Verification",
    type: "textarea",
    category: "seo",
    placeholder: "<meta name='google-site-verification' content='...' />",
    description: "Google Search Console verification code",
  },

  // Social Media
  {
    key: "social_facebook",
    label: "Facebook URL",
    type: "text",
    category: "social",
    placeholder: "https://facebook.com/yourpage",
    description: "Link to Facebook page",
  },
  {
    key: "social_twitter",
    label: "Twitter/X URL",
    type: "text",
    category: "social",
    placeholder: "https://twitter.com/youraccount",
    description: "Link to Twitter/X profile",
  },
  {
    key: "social_instagram",
    label: "Instagram URL",
    type: "text",
    category: "social",
    placeholder: "https://instagram.com/youraccount",
    description: "Link to Instagram profile",
  },
  {
    key: "social_linkedin",
    label: "LinkedIn URL",
    type: "text",
    category: "social",
    placeholder: "https://linkedin.com/company/yourcompany",
    description: "Link to LinkedIn profile",
  },
  {
    key: "social_youtube",
    label: "YouTube URL",
    type: "text",
    category: "social",
    placeholder: "https://youtube.com/@yourchannel",
    description: "Link to YouTube channel",
  },
  {
    key: "social_github",
    label: "GitHub URL",
    type: "text",
    category: "social",
    placeholder: "https://github.com/yourusername",
    description: "Link to GitHub profile",
  },

  // Email Settings
  {
    key: "email_smtp_host",
    label: "SMTP Host",
    type: "text",
    category: "email",
    placeholder: "smtp.example.com",
    description: "SMTP server hostname",
  },
  {
    key: "email_smtp_port",
    label: "SMTP Port",
    type: "number",
    category: "email",
    placeholder: "587",
    description: "SMTP server port (usually 587 or 465)",
  },
  {
    key: "email_smtp_username",
    label: "SMTP Username",
    type: "text",
    category: "email",
    placeholder: "your-email@example.com",
    description: "SMTP authentication username",
  },
  {
    key: "email_smtp_password",
    label: "SMTP Password",
    type: "password",
    category: "email",
    placeholder: "••••••••",
    description: "SMTP authentication password",
  },
  {
    key: "email_smtp_secure",
    label: "Use SSL/TLS",
    type: "toggle",
    category: "email",
    description: "Enable secure connection (SSL/TLS)",
  },
  {
    key: "email_from_email",
    label: "From Email",
    type: "email",
    category: "email",
    placeholder: "noreply@example.com",
    description: "Default sender email address",
  },
  {
    key: "email_from_name",
    label: "From Name",
    type: "text",
    category: "email",
    placeholder: "My Website",
    description: "Default sender name",
  },
];

const categories = [
  { id: "general", label: "General" },
  { id: "seo", label: "SEO" },
  { id: "social", label: "Social Media" },
  { id: "email", label: "Email" },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();

      if (data.success) {
        const settingsMap: Record<string, unknown> = {};
        data.data.forEach((setting: { key: string; value: unknown }) => {
          settingsMap[setting.key] = setting.value;
        });
        setSettings(settingsMap);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleImageSelect = (media: MediaItem | MediaItem[]) => {
    if (currentImageField) {
      const item = Array.isArray(media) ? media[0] : media;
      handleChange(currentImageField, item.url);
      setCurrentImageField(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentFields = settingsConfig.filter(
        (field) => field.category === activeTab
      );

      const promises = currentFields.map((field) =>
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: field.key,
            value: settings[field.key] ?? "",
            category: field.category,
            description: field.description,
          }),
        })
      );

      await Promise.all(promises);

      setHasChanges(false);
      toast({
        title: "Success!",
        description: "Settings saved successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    if (hasChanges) {
      if (
        !confirm(
          "You have unsaved changes. Are you sure you want to switch tabs?"
        )
      ) {
        return;
      }
      setHasChanges(false);
    }
    setActiveTab(tabId);
  };

  const renderField = (field: SettingField) => {
    const value = settings[field.key];

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            value={String(value || "")}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="admin-card admin-border admin-text"
          />
        );

      case "password":
        return (
          <Input
            type="password"
            value={String(value || "")}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="admin-card admin-border admin-text"
          />
        );

      case "textarea":
        return (
          <Textarea
            value={String(value || "")}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="admin-card admin-border admin-text"
          />
        );

      case "toggle":
        return (
          <div className="flex items-center gap-3">
            <Switch
              checked={Boolean(value)}
              onCheckedChange={(checked) => handleChange(field.key, checked)}
            />
            <span className="text-sm admin-text-muted">
              {Boolean(value) ? "Enabled" : "Disabled"}
            </span>
          </div>
        );

      case "image":
        const imageUrl = typeof value === "string" ? value : "";
        return (
          <div className="space-y-3">
            {imageUrl && (
              <div className="relative w-48 h-32 rounded-lg overflow-hidden admin-border border">
                <Image
                  src={imageUrl}
                  alt={field.label}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCurrentImageField(field.key);
                  setMediaPickerOpen(true);
                }}
                className="admin-border"
              >
                {imageUrl ? "Change Image" : "Select Image"}
              </Button>
              {imageUrl && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleChange(field.key, "")}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentFields = settingsConfig.filter(
    (field) => field.category === activeTab
  );

  if (loading) {
    return (
      <Card className="p-12">
        <div className="flex items-center justify-center">
          <p className="admin-text-secondary">Loading settings...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold admin-text mb-2">Settings</h1>
          <p className="admin-text-secondary">
            Manage your application settings and configuration
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="w-full sm:w-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Tabs */}
      <Card className="p-2">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2.5 font-medium rounded-lg transition-all ${
                activeTab === category.id
                  ? "admin-primary-bg text-white shadow-sm"
                  : "admin-text-secondary hover:bg-gray-500/10"
              }`}
              onClick={() => handleTabChange(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Settings Form */}
      <Card hover="lift">
        <CardHeader>
          <CardTitle className="admin-text text-xl">
            {categories.find((c) => c.id === activeTab)?.label} Settings
          </CardTitle>
          <CardDescription className="admin-text-secondary">
            Configure your{" "}
            {categories.find((c) => c.id === activeTab)?.label.toLowerCase()}{" "}
            settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="admin-text font-medium">
                {field.label}
              </Label>
              {renderField(field)}
              {field.description && (
                <p className="text-sm admin-text-muted">{field.description}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Media Picker */}
      <MediaPicker
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleImageSelect}
        multiple={false}
      />
    </div>
  );
}
