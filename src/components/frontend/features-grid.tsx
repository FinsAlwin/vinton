import { Zap, Shield, Users, TrendingUp, Code, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized performance ensures your applications load instantly and run smoothly.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security with 99.9% uptime guarantee for peace of mind.",
  },
  {
    icon: Users,
    title: "User Focused",
    description:
      "Intuitive interfaces designed with your users' needs at the forefront.",
  },
  {
    icon: TrendingUp,
    title: "Scalable Solutions",
    description:
      "Built to grow with your business, from startup to enterprise scale.",
  },
  {
    icon: Code,
    title: "Clean Code",
    description:
      "Well-structured, maintainable code following industry best practices.",
  },
  {
    icon: Sparkles,
    title: "Modern Tech",
    description:
      "Latest technologies and frameworks for cutting-edge solutions.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="bg-slate-50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We combine expertise, innovation, and dedication to deliver
            exceptional results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
