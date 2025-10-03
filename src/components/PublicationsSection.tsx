import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import web3AthletesCover from "@/assets/web3-athletes-cover.png";
import web2Web3MarketingCover from "@/assets/web2-web3-marketing-cover.png";
import tokenHealthScanBuildCover from "@/assets/token-health-scan-build-cover.png";
import web3SeoGuideCover from "@/assets/web3-seo-guide-cover.png";

const PublicationsSection = () => {
  const publications = [
    {
      cover: web3AthletesCover,
      title: "How Web3 is Elevating the Game for Athletes",
      description: "Exploring how blockchain is unlocking new opportunities for athletes to connect, monetize, and engage globally.",
      category: "Web3",
      link: "#",
    },
    {
      cover: web2Web3MarketingCover,
      title: "Web2 vs Web3 Marketing: Navigating the Shift – A Personal Journey",
      description: "A personal reflection on moving from traditional growth marketing to decentralized ecosystems.",
      category: "Marketing",
      link: "#",
    },
    {
      cover: tokenHealthScanBuildCover,
      title: "How I Vibe Coded Token Health Scan",
      description: "Behind the build — how I rapidly prototyped a tool to scan token projects and uncover critical risks.",
      category: "Builder Story",
      link: "#",
    },
    {
      cover: web3SeoGuideCover,
      title: "The Definitive Guide to Web3 SEO",
      description: "A practical guide to optimizing decentralized projects for visibility in a new search landscape.",
      category: "Guide",
      link: "#",
    },
  ];

  return (
    <section id="publications" className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-hero text-4xl md:text-5xl font-bold text-foreground mb-4">
            My Publications
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Articles and insights on growth, marketing, and the future of Web3.
          </p>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.map((publication, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
              onClick={() => window.location.href = publication.link}
            >
              {/* Cover Image - Compact 4:3 ratio */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={publication.cover}
                  alt={publication.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Category Badge - Top Right */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-background/90">
                    {publication.category}
                  </Badge>
                </div>
              </div>

              {/* Content - Compact */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-hero text-lg font-bold text-foreground leading-tight mb-2 line-clamp-2">
                  {publication.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                  {publication.description}
                </p>

                {/* CTA Link - Text Style */}
                <div 
                  className="flex items-center text-primary font-semibold text-sm group-hover:text-primary/80 transition-colors mt-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = publication.link;
                  }}
                >
                  Read Article
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublicationsSection;
