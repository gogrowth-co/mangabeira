/**
 * Marketing copy for the tools hub and the tokenomics simulator, in one place.
 *
 * Both the React pages and the build-time prerender (scripts/prerender.ts) import
 * this module, so the HTML a crawler receives and the HTML a person sees after
 * hydration are generated from the same strings and cannot drift apart.
 *
 * Pure data. Do not import React, assets, or anything path-aliased here: the
 * prerender loads this file in Node during the Vite build.
 */

export interface FaqEntry {
  q: string;
  a: string;
}

export interface ToolsHubCopy {
  introHeading: string;
  introParagraphs: string[];
  faqHeading: string;
  faqs: FaqEntry[];
}

export interface SimulatorCopy {
  aboutHeading: string;
  aboutParagraphs: string[];
  howHeading: string;
  howItems: { title: string; text: string }[];
  faqHeading: string;
  faqs: FaqEntry[];
}

export interface ToolsContent {
  tools: ToolsHubCopy;
  simulator: SimulatorCopy;
}

export type ContentLocale = "en" | "br" | "es";

export const TOOLS_CONTENT: Record<ContentLocale, ToolsContent> = {
  "en": {
    "tools": {
      "introHeading": "Tools Built From the Work",
      "introParagraphs": [
        "I built each of these tools while doing Web3 growth work for real protocols. They started as internal scripts to answer one question fast: is this tokenomics model going to survive year two, does this landing page convert, is this project sitting on a critical risk nobody flagged. I turned the useful ones into free tools.",
        "Six are live right now. The Tokenomics Simulator models emission schedules and staking mechanics before you launch. Token Health Scan checks a crypto project for critical risks. Web3 ROAST reviews a site for conversion and CRO issues. The Growth Experiments Framework tracks and analyzes growth experiments over time. The Shopify Grader benchmarks an e-commerce store against what actually moves revenue. The Onchain Attribution Kit connects UTM campaigns to wallet activity, so you can see which channels produce wallets that actually transact.",
        "None of them require a sign-up or a wallet connection. Use what's useful, skip what isn't."
      ],
      "faqHeading": "FAQ",
      "faqs": [
        {
          "q": "Are these tools free?",
          "a": "Yes. All five are free to use, with no trial period and no upsell inside the tool itself."
        },
        {
          "q": "Do I need to sign up or connect a wallet?",
          "a": "No. None of these tools ask for an account or a wallet connection. You open the tool, enter your inputs, and get your results."
        },
        {
          "q": "Who are these tools for?",
          "a": "Web3 founders, growth marketers, and operators who need a fast diagnostic instead of a full audit. If you're modeling a token, checking a project for risk, or benchmarking a store, one of these should get you most of the way there."
        },
        {
          "q": "Do you store my data?",
          "a": "The Tokenomics Simulator runs entirely in your browser and stores nothing on a server. The other tools only use what you submit to generate your results."
        },
        {
          "q": "What if I need help interpreting the results?",
          "a": "These tools give you a diagnostic, not a strategy. If you want help turning the output into a plan, that's what the Web3 Growth Audit is for."
        }
      ]
    },
    "simulator": {
      "aboutHeading": "About the Tokenomics Simulator",
      "aboutParagraphs": [
        "The Tokenomics Simulator projects what your token's supply and staking economics look like five years out, before you launch. Enter your token's name, max supply, annual emission rate, lockup period, staking participation, staking APY, and burn rate, and the simulator runs a year-by-year projection.",
        "It's built for founders and token designers modeling emissions before launch, and for growth leads who need to sanity-check a model someone else built. Four presets, Conservative, Growth, Aggressive, and Deflationary, give you a starting point if you don't know where to begin.",
        "It runs entirely in your browser. Nothing you enter is sent to a server or stored anywhere."
      ],
      "howHeading": "How It Works",
      "howItems": [
        {
          "title": "Set your parameters",
          "text": "Enter your token name and max supply, then set the annual emission rate, lockup period, staking participation, staking APY, and burn rate. Or start from one of the four presets and adjust from there."
        },
        {
          "title": "Read the projection",
          "text": "The simulator generates a five-year projection of circulating supply, total staked tokens, staking rewards, tokens burned, net supply change, and dilution impact, plus a supply trajectory chart, a distribution chart, and a Year 1 / Year 3 / Year 5 comparison table."
        },
        {
          "title": "Share or export",
          "text": "Copy a shareable URL that encodes your exact parameters, so you can send a specific scenario to a co-founder or investor. You can also copy the metrics to your clipboard, export the chart as a PNG, or reset and start over."
        }
      ],
      "faqHeading": "FAQ",
      "faqs": [
        {
          "q": "Is the Tokenomics Simulator free?",
          "a": "Yes. It's free, runs in your browser, and doesn't require sign-up or a wallet connection."
        },
        {
          "q": "Is my data saved anywhere?",
          "a": "No. The simulator runs entirely client-side. Nothing you enter is sent to a server or stored."
        },
        {
          "q": "How accurate is it? What are its limits?",
          "a": "The simulator is a deterministic model of the inputs you give it. It shows you exactly what your emission schedule produces mechanically, but it doesn't model market demand or predict price. Two tokens with identical supply curves can trade completely differently depending on demand."
        },
        {
          "q": "Can I model a deflationary token?",
          "a": "Yes. Set a burn rate above your emission rate, or start from the Deflationary preset (8% emission, 9-month lockup, 50% staking, 10% APY, 10% burn) and adjust from there."
        },
        {
          "q": "What should I do with the output?",
          "a": "Use it to stress-test your model before you commit to it publicly. If the Year 5 dilution number surprises you, that's the signal to change the model now, not after launch. If you want help turning the output into a launch strategy, that's what the Web3 Growth Audit covers."
        }
      ]
    }
  },
  "br": {
    "tools": {
      "introHeading": "Ferramentas Construídas a Partir do Trabalho",
      "introParagraphs": [
        "Eu construí cada uma dessas ferramentas fazendo trabalho de growth em Web3 para protocolos reais. Elas começaram como scripts internos para responder uma pergunta rápido: esse modelo de tokenomics sobrevive ao segundo ano, essa landing page converte, esse projeto tem um risco crítico que ninguém sinalizou. Transformei as mais úteis em ferramentas gratuitas.",
        "Seis estão no ar agora. O Tokenomics Simulator modela cronogramas de emissão e mecânicas de staking antes do lançamento. O Token Health Scan verifica riscos críticos em um projeto cripto. O Web3 ROAST analisa um site em busca de problemas de conversão e CRO. O Growth Experiments Framework acompanha e analisa experimentos de growth ao longo do tempo. O Shopify Grader compara uma loja de e-commerce com o que realmente move receita. O Onchain Attribution Kit conecta campanhas UTM à atividade de carteiras, mostrando quais canais geram carteiras que realmente transacionam.",
        "Nenhuma delas pede cadastro ou conexão de carteira. Use o que for útil, ignore o resto."
      ],
      "faqHeading": "Perguntas Frequentes",
      "faqs": [
        {
          "q": "As ferramentas são gratuitas?",
          "a": "Sim. As cinco são gratuitas, sem período de teste e sem venda casada dentro da própria ferramenta."
        },
        {
          "q": "Preciso me cadastrar ou conectar uma carteira?",
          "a": "Não. Nenhuma dessas ferramentas pede conta ou conexão de carteira. Você abre a ferramenta, insere os dados e recebe o resultado."
        },
        {
          "q": "Para quem são essas ferramentas?",
          "a": "Founders, growth marketers e operadores de Web3 que precisam de um diagnóstico rápido em vez de uma auditoria completa. Se você está modelando um token, checando riscos de um projeto ou comparando uma loja, uma dessas ferramentas resolve a maior parte do caminho."
        },
        {
          "q": "Vocês armazenam meus dados?",
          "a": "O Tokenomics Simulator roda inteiramente no seu navegador e não guarda nada em servidor. As outras ferramentas usam apenas o que você envia para gerar o resultado."
        },
        {
          "q": "E se eu precisar de ajuda para interpretar os resultados?",
          "a": "Essas ferramentas entregam um diagnóstico, não uma estratégia. Se você quiser ajuda para transformar o resultado em um plano, é para isso que serve o Web3 Growth Audit."
        }
      ]
    },
    "simulator": {
      "aboutHeading": "Sobre o Tokenomics Simulator",
      "aboutParagraphs": [
        "O Tokenomics Simulator projeta como ficam a oferta e a economia de staking do seu token daqui a cinco anos, antes do lançamento. Insira o nome do token, o supply máximo, a taxa de emissão anual, o período de lockup, a participação em staking, o APY de staking e a taxa de queima, e o simulador gera uma projeção ano a ano.",
        "Foi feito para founders e desenhistas de tokenomics que estão modelando emissões antes do lançamento, e para líderes de growth que precisam checar um modelo feito por outra pessoa. Quatro presets, Conservador, Crescimento, Agressivo e Deflacionário, dão um ponto de partida se você não souber por onde começar.",
        "Ele roda inteiramente no seu navegador. Nada do que você insere é enviado a um servidor ou armazenado em qualquer lugar."
      ],
      "howHeading": "Como Funciona",
      "howItems": [
        {
          "title": "Defina seus parâmetros",
          "text": "Insira o nome do token e o supply máximo, depois ajuste a taxa de emissão anual, o período de lockup, a participação em staking, o APY de staking e a taxa de queima. Ou comece por um dos quatro presets e ajuste a partir dali."
        },
        {
          "title": "Leia a projeção",
          "text": "O simulador gera uma projeção de cinco anos com supply em circulação, total em staking, recompensas de staking, tokens queimados, variação líquida de supply e impacto de diluição, além de um gráfico de trajetória de supply, um gráfico de distribuição e uma tabela comparando Ano 1, Ano 3 e Ano 5."
        },
        {
          "title": "Compartilhe ou exporte",
          "text": "Copie uma URL compartilhável que guarda seus parâmetros exatos, para enviar um cenário específico a um co-founder ou investidor. Você também pode copiar as métricas para a área de transferência, exportar o gráfico como PNG ou resetar e começar de novo."
        }
      ],
      "faqHeading": "Perguntas Frequentes",
      "faqs": [
        {
          "q": "O Tokenomics Simulator é gratuito?",
          "a": "Sim. É gratuito, roda no navegador e não exige cadastro nem conexão de carteira."
        },
        {
          "q": "Meus dados ficam salvos em algum lugar?",
          "a": "Não. O simulador roda inteiramente no seu navegador. Nada do que você insere é enviado a um servidor ou armazenado."
        },
        {
          "q": "Qual a precisão dele? Quais são os limites?",
          "a": "O simulador é um modelo determinístico dos dados que você insere. Ele mostra exatamente o que seu cronograma de emissão produz mecanicamente, mas não modela demanda de mercado nem prevê preço. Dois tokens com curvas de supply idênticas podem se comportar de forma completamente diferente dependendo da demanda."
        },
        {
          "q": "Consigo modelar um token deflacionário?",
          "a": "Sim. Defina uma taxa de queima acima da taxa de emissão, ou comece pelo preset Deflacionário (8% de emissão, 9 meses de lockup, 50% de staking, 10% de APY, 10% de queima) e ajuste a partir dali."
        },
        {
          "q": "O que eu faço com o resultado?",
          "a": "Use para testar seu modelo antes de assumir um compromisso público com ele. Se o número de diluição do Ano 5 te surpreender, esse é o sinal para mudar o modelo agora, não depois do lançamento. Se você quiser ajuda para transformar o resultado em uma estratégia de lançamento, é para isso que serve o Web3 Growth Audit."
        }
      ]
    }
  },
  "es": {
    "tools": {
      "introHeading": "Herramientas Construidas Desde el Trabajo",
      "introParagraphs": [
        "Construí cada una de estas herramientas mientras hacía trabajo de growth en Web3 para protocolos reales. Empezaron como scripts internos para responder una pregunta rápido: este modelo de tokenomics, sobrevive al segundo año, esta landing page, convierte, este proyecto, tiene un riesgo crítico que nadie marcó. Convertí las más útiles en herramientas gratuitas.",
        "Hay seis activas ahora mismo. El Tokenomics Simulator modela cronogramas de emisión y mecánicas de staking antes del lanzamiento. Token Health Scan revisa un proyecto cripto en busca de riesgos críticos. Web3 ROAST analiza un sitio para detectar problemas de conversión y CRO. El Growth Experiments Framework registra y analiza experimentos de growth a lo largo del tiempo. El Shopify Grader compara una tienda de e-commerce con lo que realmente mueve ingresos. El Onchain Attribution Kit conecta campañas UTM a la actividad de billeteras, para ver qué canales generan billeteras que realmente transaccionan.",
        "Ninguna pide registro ni conexión de wallet. Usa lo que te sirva, ignora el resto."
      ],
      "faqHeading": "Preguntas Frecuentes",
      "faqs": [
        {
          "q": "¿Las herramientas son gratuitas?",
          "a": "Sí. Las cinco son gratuitas, sin período de prueba ni venta adicional dentro de la herramienta."
        },
        {
          "q": "¿Necesito registrarme o conectar una wallet?",
          "a": "No. Ninguna de estas herramientas pide una cuenta ni conexión de wallet. Abres la herramienta, ingresas tus datos y obtienes el resultado."
        },
        {
          "q": "¿Para quién son estas herramientas?",
          "a": "Founders, growth marketers y operadores de Web3 que necesitan un diagnóstico rápido en lugar de una auditoría completa. Si estás modelando un token, revisando riesgos de un proyecto o comparando una tienda, alguna de estas herramientas te resuelve casi todo el camino."
        },
        {
          "q": "¿Guardan mis datos?",
          "a": "El Tokenomics Simulator corre completamente en tu navegador y no guarda nada en un servidor. Las demás herramientas usan solo lo que envías para generar tu resultado."
        },
        {
          "q": "¿Y si necesito ayuda para interpretar los resultados?",
          "a": "Estas herramientas entregan un diagnóstico, no una estrategia. Si quieres ayuda para convertir el resultado en un plan, para eso está el Web3 Growth Audit."
        }
      ]
    },
    "simulator": {
      "aboutHeading": "Sobre el Tokenomics Simulator",
      "aboutParagraphs": [
        "El Tokenomics Simulator proyecta cómo quedan la oferta y la economía de staking de tu token dentro de cinco años, antes de lanzar. Ingresa el nombre del token, el supply máximo, la tasa de emisión anual, el período de lockup, la participación en staking, el APY de staking y la tasa de quema, y el simulador genera una proyección año por año.",
        "Está hecho para founders y diseñadores de tokenomics que están modelando emisiones antes del lanzamiento, y para líderes de growth que necesitan revisar un modelo que armó otra persona. Cuatro presets, Conservador, Crecimiento, Agresivo y Deflacionario, te dan un punto de partida si no sabes por dónde empezar.",
        "Corre completamente en tu navegador. Nada de lo que ingresas se envía a un servidor ni se guarda en ningún lado."
      ],
      "howHeading": "Cómo Funciona",
      "howItems": [
        {
          "title": "Define tus parámetros",
          "text": "Ingresa el nombre del token y el supply máximo, luego ajusta la tasa de emisión anual, el período de lockup, la participación en staking, el APY de staking y la tasa de quema. O empieza desde uno de los cuatro presets y ajusta desde ahí."
        },
        {
          "title": "Lee la proyección",
          "text": "El simulador genera una proyección a cinco años con supply en circulación, total en staking, recompensas de staking, tokens quemados, cambio neto de supply e impacto de dilución, además de un gráfico de trayectoria de supply, un gráfico de distribución y una tabla que compara Año 1, Año 3 y Año 5."
        },
        {
          "title": "Comparte o exporta",
          "text": "Copia una URL compartible que guarda tus parámetros exactos, para enviar un escenario específico a un cofundador o inversor. También puedes copiar las métricas al portapapeles, exportar el gráfico como PNG o reiniciar y empezar de nuevo."
        }
      ],
      "faqHeading": "Preguntas Frecuentes",
      "faqs": [
        {
          "q": "¿El Tokenomics Simulator es gratuito?",
          "a": "Sí. Es gratuito, corre en el navegador y no requiere registro ni conexión de wallet."
        },
        {
          "q": "¿Mis datos quedan guardados en algún lado?",
          "a": "No. El simulador corre completamente en tu navegador. Nada de lo que ingresas se envía a un servidor ni se guarda."
        },
        {
          "q": "¿Qué tan preciso es? ¿Cuáles son sus límites?",
          "a": "El simulador es un modelo determinístico de los datos que ingresas. Te muestra exactamente lo que produce tu cronograma de emisión de forma mecánica, pero no modela la demanda de mercado ni predice el precio. Dos tokens con curvas de supply idénticas pueden comportarse de forma totalmente distinta según la demanda."
        },
        {
          "q": "¿Puedo modelar un token deflacionario?",
          "a": "Sí. Define una tasa de quema por encima de la tasa de emisión, o empieza desde el preset Deflacionario (8% de emisión, 9 meses de lockup, 50% de staking, 10% de APY, 10% de quema) y ajusta desde ahí."
        },
        {
          "q": "¿Qué hago con el resultado?",
          "a": "Úsalo para poner a prueba tu modelo antes de comprometerte públicamente con él. Si el número de dilución del Año 5 te sorprende, esa es la señal para cambiar el modelo ahora, no después del lanzamiento. Si quieres ayuda para convertir el resultado en una estrategia de lanzamiento, para eso está el Web3 Growth Audit."
        }
      ]
    }
  }
};

/** Maps the app's lang prop (`en` | `pt-BR` | `es`) onto this module's locale keys. */
export function contentLocale(lang?: string): ContentLocale {
  if (lang === "pt-BR" || lang === "br") return "br";
  if (lang === "es") return "es";
  return "en";
}

/** FAQPage JSON-LD built from the same entries the accordion renders. */
export function faqSchema(faqs: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
