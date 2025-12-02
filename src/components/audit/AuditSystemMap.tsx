import auditSystemMap from "@/assets/audit-system-map.png";

const AuditSystemMap = () => {
  return (
    <section className="py-20 lg:py-28 bg-light-gray">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy mb-4">
            How I Audit Your Entire Growth Engine
          </h2>
          <p className="font-body-audit text-lg text-charcoal/70 max-w-2xl mx-auto">
            A complete view of your ecosystem — all mapped, analyzed, and benchmarked.
          </p>
        </div>
        
        {/* Visual: Miro board screenshot */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-card p-4 lg:p-8 hover:shadow-card-hover transition-shadow duration-300">
            <img 
              src={auditSystemMap}
              alt="Audit System Map showing Website, dApp, Social Media, Community, SEO, and PR analysis"
              className="w-full rounded-lg"
            />
            <p className="text-center text-sm text-charcoal/60 mt-4 font-body-audit">
              Every audit covers Website, dApp, Social, Community, SEO & PR — with insights, benchmarks, fixes, and a prioritized action plan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuditSystemMap;
