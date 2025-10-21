import Image from "next/image";
import { getProjects } from "@/lib/frontend-api";
import { ExternalLink } from "lucide-react";

export default async function ProjectsShowcase() {
  const { data: projects } = await getProjects(6);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="bg-slate-50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Showcasing our latest work and success stories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(
            (
              project: {
                title: string;
                description?: string;
                metadata?: { featuredImage?: string };
              },
              index: number
            ) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative h-64 bg-gradient-to-br from-blue-500 to-emerald-500 overflow-hidden">
                  {project.metadata?.featuredImage ? (
                    <Image
                      src={project.metadata.featuredImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold opacity-20">
                      {project.title.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="text-white" size={32} />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {project.description || "View project details."}
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
