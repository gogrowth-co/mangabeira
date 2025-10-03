import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <section className="py-20 px-6 bg-background">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publications.map((publication, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => window.location.href = publication.link}
            >
              {/* Cover Image */}
              <div className="relative overflow-hidden">
                <img
                  src={publication.cover}
                  alt={publication.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-hero text-xl font-bold text-foreground leading-tight flex-1">
                    {publication.title}
                  </h3>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {publication.category}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                  {publication.description}
                </p>

                {/* CTA Button */}
                <Button 
                  className="w-full bg-gradient-cta text-white font-bold rounded-lg hover:shadow-button-hover hover:brightness-110 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = publication.link;
                  }}
                >
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublicationsSection;
