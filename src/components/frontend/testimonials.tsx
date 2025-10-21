import Image from "next/image";
import { getTestimonials } from "@/lib/frontend-api";
import { Quote } from "lucide-react";

export default async function Testimonials() {
  const { data: testimonials } = await getTestimonials(6);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="bg-slate-50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from our satisfied
            clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(
            (
              testimonial: {
                title: string;
                description?: string;
                metadata?: { featuredImage?: string };
              },
              index: number
            ) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow relative"
              >
                <Quote
                  className="absolute top-6 right-6 text-blue-500/20"
                  size={48}
                />
                <div className="relative">
                  <p className="text-gray-700 mb-6 italic">
                    &quot;
                    {testimonial.description ||
                      "Great service and excellent results!"}
                    &quot;
                  </p>
                  <div className="flex items-center gap-4">
                    {testimonial.metadata?.featuredImage ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.metadata.featuredImage}
                          alt={testimonial.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                        {testimonial.title.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
