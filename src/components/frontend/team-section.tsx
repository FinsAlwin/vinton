import Image from "next/image";
import { getTeam } from "@/lib/frontend-api";
import { User } from "lucide-react";

export default async function TeamSection() {
  const { data: team } = await getTeam(8);

  if (!team || team.length === 0) {
    return null;
  }

  return (
    <section id="team" className="bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Talented professionals dedicated to your success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map(
            (
              member: {
                title: string;
                description?: string;
                metadata?: { featuredImage?: string };
              },
              index: number
            ) => (
              <div key={index} className="text-center group">
                <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-emerald-500">
                  {member.metadata?.featuredImage ? (
                    <Image
                      src={member.metadata.featuredImage}
                      alt={member.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="text-white" size={64} />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {member.description || "Team Member"}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
