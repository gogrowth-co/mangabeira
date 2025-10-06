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
    <section className="relative w-full bg-[#FFFFFF] py-8 md:py-9 lg:py-10">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[rgba(10,31,52,0.06)] to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 md:px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-4 md:mb-5 lg:mb-6">
          <h2 className="font-bold mb-3 md:mb-1.5 lg:mb-2" style={{ fontSize: 'clamp(32px, 3.5vw, 36px)', lineHeight: '1.2', fontWeight: 800, color: '#1A202C' }}>
            As Seen On
          </h2>
          <p className="font-body" style={{ fontSize: '16px', fontWeight: 500, color: '#2D3748' }}>
            Features & mentions from global media.
          </p>
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
