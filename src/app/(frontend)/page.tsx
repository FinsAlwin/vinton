import { getSettings, getSettingValue } from "@/lib/settings";
import Navigation from "@/components/frontend/navigation";
import HeroSection from "@/components/frontend/hero-section";
import FeaturesGrid from "@/components/frontend/features-grid";
import ServicesSection from "@/components/frontend/services-section";
import ProjectsShowcase from "@/components/frontend/projects-showcase";
import TeamSection from "@/components/frontend/team-section";
import Testimonials from "@/components/frontend/testimonials";
import CTASection from "@/components/frontend/cta-section";
import Footer from "@/components/frontend/footer";
import MaintenanceWrapper from "@/components/frontend/maintenance-wrapper";

export const metadata = {
  title: "Vinton - Build Something Amazing",
  description:
    "We create innovative solutions that help your business grow and succeed in the digital world.",
};

export default async function HomePage() {
  const settings = await getSettings();
  const siteName = getSettingValue<string>(settings, "site_name", "Vinton");
  const siteLogo = getSettingValue<string>(settings, "site_logo");

  return (
    <MaintenanceWrapper>
      <div className="min-h-screen bg-white">
        <Navigation siteName={siteName} siteLogo={siteLogo} />
        <HeroSection />
        <FeaturesGrid />
        <ServicesSection />
        <ProjectsShowcase />
        <TeamSection />
        <Testimonials />
        <CTASection />
        <Footer />
      </div>
    </MaintenanceWrapper>
  );
}
