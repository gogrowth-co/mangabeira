import olympicsLogo from "@/assets/olympics-logo.png";
import globoEsporteLogo from "@/assets/globo-esporte-logo.png";
import nscTotalLogo from "@/assets/nsc-total-logo.png";

const AsSeenOnSection = () => {
  const logos = [
    { src: olympicsLogo, alt: "Olympics.com", name: "Olympics.com", url: "https://www.olympics.com/en/athletes/gabriel-mangabeira" },
    { src: globoEsporteLogo, alt: "Globo Esporte", name: "Globo Esporte", url: "https://ge.globo.com/Jogos-Mundiais-Militares/noticia/2011/07/gabriel-mangabeira-leva-sozinho-cinco-ouros-e-uma-prata-no-maria-lenk.html" },
    { src: nscTotalLogo, alt: "NSC Total", name: "NSC Total", url: "https://www.nsctotal.com.br/noticias/mangabeira-fica-em-sexto-e-phelps-leva-seu-quinto-ouro" },
  ];

  return (
    <section className="relative w-full bg-bg-mist py-14 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h3 className="text-xs md:text-sm font-body font-semibold tracking-wider uppercase text-text-secondary">
            Trusted by global brands.
          </h3>
        </div>

        {/* Logos Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {logos.map((logo, index) => (
            <a
              key={index}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-28 md:w-36 h-16 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AsSeenOnSection;
