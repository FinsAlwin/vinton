import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroSection({
  title = "Build Something Amazing",
  subtitle = "We create innovative solutions that help your business grow and succeed in the digital world.",
  ctaText = "Get Started",
  ctaLink = "#contact",
}: HeroSectionProps) {
  return (
    <section id="home" className="gradient-hero text-white">
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={ctaLink}
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {ctaText}
              <ArrowRight size={20} />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
