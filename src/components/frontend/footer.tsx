import { getSettings, getSettingValue } from "@/lib/settings";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default async function Footer() {
  const settings = await getSettings();

  const siteName = getSettingValue<string>(settings, "site_name", "Vinton");
  const contactEmail = getSettingValue<string>(settings, "contact_email");
  const contactPhone = getSettingValue<string>(settings, "contact_phone");
  const contactAddress = getSettingValue<string>(settings, "contact_address");

  const socialFacebook = getSettingValue<string>(settings, "social_facebook");
  const socialTwitter = getSettingValue<string>(settings, "social_twitter");
  const socialInstagram = getSettingValue<string>(settings, "social_instagram");
  const socialLinkedin = getSettingValue<string>(settings, "social_linkedin");
  const socialYoutube = getSettingValue<string>(settings, "social_youtube");
  const socialGithub = getSettingValue<string>(settings, "social_github");

  const socialLinks = [
    { url: socialFacebook, icon: Facebook, label: "Facebook" },
    { url: socialTwitter, icon: Twitter, label: "Twitter" },
    { url: socialInstagram, icon: Instagram, label: "Instagram" },
    { url: socialLinkedin, icon: Linkedin, label: "LinkedIn" },
    { url: socialYoutube, icon: Youtube, label: "YouTube" },
    { url: socialGithub, icon: Github, label: "GitHub" },
  ].filter((link) => link.url);

  const hasContactInfo = contactEmail || contactPhone || contactAddress;
  const hasSocialLinks = socialLinks.length > 0;

  // Don't render footer if there's no content to display
  if (!hasContactInfo && !hasSocialLinks) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          {hasContactInfo && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                {contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a
                      href={`mailto:${contactEmail}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {contactEmail}
                    </a>
                  </div>
                )}
                {contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${contactPhone}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {contactPhone}
                    </a>
                  </div>
                )}
                {contactAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span className="whitespace-pre-line">
                      {contactAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Media Links */}
          {hasSocialLinks && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={link.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
