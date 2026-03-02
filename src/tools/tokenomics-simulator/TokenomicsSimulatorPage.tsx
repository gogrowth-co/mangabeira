import { useState, useEffect, useMemo, useCallback } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, Info } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SimulatorSEO from "./SimulatorSEO"
import ConfigPanel from "./ConfigPanel"
import ResultsPanel from "./ResultsPanel"
import { en, ptBR, es } from "./strings"
import { DEFAULT_PARAMS, simulateTokenomics, encodeParamsToURL, decodeParamsFromURL, PRESETS } from "./engine"
import type { SimulationParams } from "./engine"
import type { Locale } from "@/lib/translations"

interface TokenomicsSimulatorPageProps {
  lang: "en" | "pt-BR" | "es"
}

const langToLocale: Record<string, Locale> = {
  en: "en",
  "pt-BR": "br",
  es: "es",
}

const homeLinks: Record<string, string> = {
  en: "/",
  "pt-BR": "/br",
  es: "/es",
}

export default function TokenomicsSimulatorPage({ lang }: TokenomicsSimulatorPageProps) {
  const strings = lang === "pt-BR" ? ptBR : lang === "es" ? es : en
  const locale = langToLocale[lang]

  const [params, setParams] = useState<SimulationParams>(() => {
    return decodeParamsFromURL() || { ...DEFAULT_PARAMS }
  })
  const [activePreset, setActivePreset] = useState<string | null>(null)

  // Sync URL on param change
  useEffect(() => {
    const encoded = encodeParamsToURL(params)
    window.history.replaceState(null, "", `?${encoded}`)
  }, [params])

  const result = useMemo(() => simulateTokenomics(params), [params])

  const handleParamsChange = useCallback((partial: Partial<SimulationParams>) => {
    setParams(prev => ({ ...prev, ...partial }))
    setActivePreset(null) // Clear preset when manually changing
  }, [])

  const handlePreset = useCallback((key: string) => {
    const preset = PRESETS[key]
    setParams(prev => ({ ...prev, ...preset }))
    setActivePreset(key)
  }, [])

  const handleReset = useCallback(() => {
    setParams({ ...DEFAULT_PARAMS })
    setActivePreset(null)
  }, [])

  return (
    <div className="min-h-screen bg-[hsl(210,25%,97%)]">
      <SimulatorSEO lang={lang} />
      <Header locale={locale} />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm font-body text-muted-foreground mb-6">
          <Link to={homeLinks[lang]} className="hover:text-[hsl(200,100%,55%)] transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-muted-foreground">{strings.breadcrumbTools}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[hsl(210,65%,15%)] font-medium">{strings.breadcrumbPage}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-3xl md:text-4xl font-hero font-bold text-[hsl(210,65%,15%)]">
              {strings.pageTitle}
            </h1>
            <span className="inline-block px-3 py-1 text-xs font-accent font-semibold bg-[hsl(45,100%,50%)] text-[hsl(210,65%,15%)] rounded-full">
              {strings.badge}
            </span>
          </div>
          <p className="text-base md:text-lg font-body text-[hsl(0,0%,20%)] max-w-3xl">
            {strings.pageSubtitle}
          </p>
        </div>

        {/* Info Bar */}
        <div className="bg-[rgba(31,182,255,0.08)] border-l-[3px] border-l-[hsl(200,100%,55%)] rounded-md px-4 py-3 mb-10 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-[hsl(200,100%,55%)] shrink-0 mt-0.5" />
          <p className="text-sm font-body text-[hsl(0,0%,20%)]">{strings.infoBar}</p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Config sidebar */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="lg:sticky lg:top-24">
              <ConfigPanel
                strings={strings}
                params={params}
                activePreset={activePreset}
                onParamsChange={handleParamsChange}
                onPreset={handlePreset}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <ResultsPanel strings={strings} params={params} result={result} lang={lang} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
