import { BarChart3, Wallet, Eye, GitBranch, TrendingUp, Map } from "lucide-react";
import { ta } from "@/lib/auditTranslations";

type Locale = 'en' | 'br' | 'es';

interface FeaturesGridProps {
  locale: Locale;
}

const FeaturesGrid = ({ locale }: FeaturesGridProps) => {
  const features = [
    {
      icon: BarChart3,
      title: ta('audit.features.item1.title', locale),
      description: ta('audit.features.item1.description', locale)
    },
    {
      icon: Wallet,
      title: ta('audit.features.item2.title', locale),
      description: ta('audit.features.item2.description', locale)
    },
    {
      icon: Eye,
      title: ta('audit.features.item3.title', locale),
      description: ta('audit.features.item3.description', locale)
    },
    {
      icon: GitBranch,
      title: ta('audit.features.item4.title', locale),
      description: ta('audit.features.item4.description', locale)
    },
    {
      icon: TrendingUp,
      title: ta('audit.features.item5.title', locale),
      description: ta('audit.features.item5.description', locale)
    },
    {
      icon: Map,
      title: ta('audit.features.item6.title', locale),
      description: ta('audit.features.item6.description', locale)
    }
  ];

  return (
    <section className="bg-navy py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <h2 
          className="font-hero text-3xl font-bold text-white text-center mb-12"
        >
          {ta('audit.features.title', locale)}
        </h2>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-l-4 border-aqua shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className="h-8 w-8 text-aqua mb-4" />
                <h3 
                  className="font-hero font-semibold text-navy mb-2"
                >
                  {feature.title}
                </h3>
                <p 
                  className="font-body text-gray-600 text-sm leading-relaxed"
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
