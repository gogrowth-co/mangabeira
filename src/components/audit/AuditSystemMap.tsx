import auditSystemMap from "@/assets/audit-system-map.png";

const AuditSystemMap = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-hero font-bold text-3xl md:text-4xl text-primary mb-4">
            How I Audit Your Entire Growth Engine
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete view of your ecosystem — all mapped, analyzed, and benchmarked.
          </p>
        </div>
        
        {/* Visual: Miro board screenshot */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-xl shadow-card p-4 lg:p-8 hover:shadow-card-hover transition-shadow duration-300">
            <img 
              src={auditSystemMap}
              alt="Audit System Map showing Website, dApp, Social Media, Community, SEO, and PR analysis"
              className="w-full rounded-lg"
            />
            <p className="text-center text-sm text-muted-foreground mt-4 font-body">
              Every audit covers Website, dApp, Social, Community, SEO & PR — with insights, benchmarks, fixes, and a prioritized action plan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuditSystemMap;
