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
  const siteDescription = getSettingValue<string>(
    settings,
    "site_description",
    "Building innovative digital solutions for modern businesses."
  );
  const contactEmail = getSettingValue<string>(
    settings,
    "contact_email",
    "contact@example.com"
  );
  const contactPhone = getSettingValue<string>(
    settings,
    "contact_phone",
    "+1 (555) 123-4567"
  );
  const contactAddress = getSettingValue<string>(
    settings,
    "contact_address",
    "123 Business St, City, Country"
  );

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

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">{siteName}</h3>
            <p className="text-gray-400 mb-4">{siteDescription}</p>
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={link.label}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Team
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">Web Development</span>
              </li>
              <li>
                <span className="text-gray-400">Mobile Apps</span>
              </li>
              <li>
                <span className="text-gray-400">UI/UX Design</span>
              </li>
              <li>
                <span className="text-gray-400">Consulting</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              {contactEmail && (
                <li className="flex items-start gap-2">
                  <Mail size={18} className="mt-1 text-blue-400" />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
              {contactPhone && (
                <li className="flex items-start gap-2">
                  <Phone size={18} className="mt-1 text-blue-400" />
                  <a
                    href={`tel:${contactPhone}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {contactPhone}
                  </a>
                </li>
              )}
              {contactAddress && (
                <li className="flex items-start gap-2">
                  <MapPin size={18} className="mt-1 text-blue-400" />
                  <span className="text-gray-400">{contactAddress}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>
            © {currentYear} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
