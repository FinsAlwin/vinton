import Image from "next/image";
import { getServices } from "@/lib/frontend-api";

export default async function ServicesSection() {
  const { data: services } = await getServices(6);

  // Fallback services if no CMS content
  const defaultServices = [
    {
      title: "Web Development",
      description:
        "Custom web applications built with modern technologies and best practices.",
      image: null,
    },
    {
      title: "Mobile Apps",
      description:
        "Native and cross-platform mobile applications for iOS and Android.",
      image: null,
    },
    {
      title: "UI/UX Design",
      description:
        "Beautiful, intuitive interfaces that users love to interact with.",
      image: null,
    },
  ];

  const displayServices =
    services && services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions tailored to your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map(
            (
              service: {
                title: string;
                description?: string;
                metadata?: { featuredImage?: string };
              },
              index: number
            ) => (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
              >
                {service.metadata?.featuredImage && (
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-emerald-500">
                    <Image
                      src={service.metadata.featuredImage}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {!service.metadata?.featuredImage && (
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-emerald-500" />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {service.description ||
                      "Professional service tailored to your needs."}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
