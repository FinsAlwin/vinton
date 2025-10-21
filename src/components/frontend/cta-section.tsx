import { ArrowRight, Mail } from "lucide-react";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function CTASection({
  title = "Ready to Get Started?",
  subtitle = "Let's work together to bring your ideas to life. Contact us today for a free consultation.",
  buttonText = "Contact Us Now",
}: CTASectionProps) {
  return (
    <section id="contact" className="gradient-cta text-white">
      <div className="section-container text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-white/90 mb-8">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@example.com"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Mail size={20} />
              {buttonText}
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
