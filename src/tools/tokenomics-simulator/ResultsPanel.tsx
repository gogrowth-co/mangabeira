import { useRef, useCallback } from "react"
import { Copy, Link2, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { toast } from "sonner"
import type { SimulatorStrings } from "./strings"
import type { SimulationParams, SimulationResult } from "./engine"
import { formatNumber, encodeParamsToURL } from "./engine"
import MetricCard from "./MetricCard"
import InsightsPanel from "./InsightsPanel"

interface ResultsPanelProps {
  strings: SimulatorStrings
  params: SimulationParams
  result: SimulationResult
  lang: "en" | "pt-BR" | "es"
}

const AQUA = "#1FB6FF"
const GREEN = "#10B981"
const RED = "#EF4444"
const NAVY = "#0A2540"

const articleLinks: Record<string, string> = {
  en: "/publications/defi-tokenomics-simulator-guide",
  "pt-BR": "/br/artigos/como-projetar-tokenomics-crescimento-protocolo",
  es: "/es/articulos/como-disenar-tokenomics-crecimiento-protocolo",
}

export default function ResultsPanel({ strings, params, result, lang }: ResultsPanelProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleCopyMetrics = useCallback(() => {
    const m = result.year1Metrics
    const text = [
      `${strings.configTitle}`,
      `Token: ${params.tokenName}`,
      `Max Supply: ${formatNumber(params.maxSupply)}`,
      `Emission: ${params.emissionRate}% | Lockup: ${params.lockupMonths}mo | Staking: ${params.stakingParticipation}% | APY: ${params.stakingAPY}% | Burn: ${params.burnRate}%`,
      "",
      strings.year1Title,
      `${strings.circulatingSupply}: ${formatNumber(m.circulatingSupply)}`,
      `${strings.totalStaked}: ${formatNumber(m.staked)}`,
      `${strings.stakingRewards}: ${formatNumber(m.rewards)}`,
      `${strings.tokensBurned}: ${formatNumber(m.burned)}`,
      `${strings.netSupplyChange}: ${formatNumber(m.netChange)}`,
      `${strings.dilutionImpact}: ${m.dilution.toFixed(2)}%`,
    ].join("\n")
    navigator.clipboard.writeText(text)
    toast.success(strings.copiedToast)
  }, [result, params, strings])

  const handleShareURL = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}?${encodeParamsToURL(params)}`
    navigator.clipboard.writeText(url)
    toast.success(strings.linkCopiedToast)
  }, [params, strings])

  const handleExportPNG = useCallback(async () => {
    if (!sectionRef.current) return
    const html2canvas = (await import("html2canvas")).default
    const canvas = await html2canvas(sectionRef.current, { scale: 2, backgroundColor: "#FFFFFF" })
    const link = document.createElement("a")
    const date = new Date().toISOString().slice(0, 10)
    link.download = `tokenomics-${params.tokenName.toLowerCase()}-${date}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }, [params.tokenName])

  // Chart data
  const lineData = result.yearlyData.map(y => ({
    year: `Y${y.year}`,
    [strings.chartCirculating]: y.circulatingSupply,
    [strings.chartStaked]: y.staked,
  }))

  const pieData = [
    { name: strings.chartStaked, value: result.supplyDistribution.staked, color: GREEN },
    { name: strings.chartCirculating, value: result.supplyDistribution.circulating, color: AQUA },
    { name: strings.chartBurned, value: result.supplyDistribution.burned, color: RED },
  ]

  // Table rows
  const y1 = result.yearlyData[0]
  const y3 = result.yearlyData[2]
  const y5 = result.yearlyData[4]

  const tableRows = [
    { label: strings.circulatingSupply, y1: formatNumber(y1.circulatingSupply), y3: formatNumber(y3.circulatingSupply), y5: formatNumber(y5.circulatingSupply) },
    { label: strings.totalStaked, y1: formatNumber(y1.staked), y3: formatNumber(y3.staked), y5: formatNumber(y5.staked) },
    { label: strings.tokensBurned, y1: formatNumber(y1.burned), y3: formatNumber(y3.cumulativeBurned), y5: formatNumber(y5.cumulativeBurned) },
    { label: strings.dilutionImpact, y1: `${y1.dilution.toFixed(1)}%`, y3: `${y3.dilution.toFixed(1)}%`, y5: `${y5.dilution.toFixed(1)}%`, isDilution: true },
  ]

  const dilutionColor = (val: number) => {
    if (Math.abs(val) > 10) return "text-red-600"
    if (Math.abs(val) > 5) return "text-amber-600"
    return "text-emerald-600"
  }

  return (
    <div id="results-section" ref={sectionRef} className="space-y-8">
      {/* Export buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" onClick={handleCopyMetrics} className="gap-2 text-[hsl(210,65%,15%)] border-[hsl(210,65%,15%)]/20">
          <Copy className="h-4 w-4" /> {strings.copyMetrics}
        </Button>
        <Button variant="outline" size="sm" onClick={handleShareURL} className="gap-2 text-[hsl(210,65%,15%)] border-[hsl(210,65%,15%)]/20">
          <Link2 className="h-4 w-4" /> {strings.shareUrl}
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportPNG} className="gap-2 text-[hsl(210,65%,15%)] border-[hsl(210,65%,15%)]/20">
          <Image className="h-4 w-4" /> {strings.exportPng}
        </Button>
      </div>

      {/* Year 1 Metrics */}
      <div>
        <h3 className="text-lg font-hero font-semibold text-[hsl(210,65%,15%)] mb-4">{strings.year1Title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard label={strings.circulatingSupply} value={result.year1Metrics.circulatingSupply} tokenName={params.tokenName} />
          <MetricCard label={strings.totalStaked} value={result.year1Metrics.staked} tokenName={params.tokenName} />
          <MetricCard label={strings.stakingRewards} value={result.year1Metrics.rewards} tokenName={params.tokenName} />
          <MetricCard label={strings.tokensBurned} value={result.year1Metrics.burned} tokenName={params.tokenName} />
          <MetricCard label={strings.netSupplyChange} value={result.year1Metrics.netChange} tokenName={params.tokenName} />
          <MetricCard label={strings.dilutionImpact} value={result.year1Metrics.dilution} tokenName={params.tokenName} isPercentage colorCode="dilution" />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-hero font-semibold text-[hsl(210,65%,15%)] mb-4">{strings.trajectoryTitle}</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fill: NAVY, fontSize: 12 }} />
            <YAxis tickFormatter={v => formatNumber(v)} tick={{ fill: NAVY, fontSize: 12 }} />
            <RechartsTooltip
              contentStyle={{ backgroundColor: NAVY, border: "none", borderRadius: 8, color: "#fff", fontSize: 13 }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
              formatter={(value: number) => formatNumber(value)}
            />
            <Line type="monotone" dataKey={strings.chartCirculating} stroke={AQUA} strokeWidth={3} dot={{ r: 4, fill: AQUA }} />
            <Line type="monotone" dataKey={strings.chartStaked} stroke={GREEN} strokeWidth={3} dot={{ r: 4, fill: GREEN }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-hero font-semibold text-[hsl(210,65%,15%)] mb-4">{strings.distributionTitle}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={{ backgroundColor: NAVY, border: "none", borderRadius: 8, color: "#fff", fontSize: 13 }}
              formatter={(value: number) => formatNumber(value)}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Scenario Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <h3 className="text-lg font-hero font-semibold text-[hsl(210,65%,15%)] p-6 pb-0 flex items-center gap-2">
          {strings.scenarioTitle}
        </h3>
        <div className="p-6 pt-4">
          <div className="rounded-xl overflow-hidden border border-[hsl(210,65%,15%)]/10">
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(210,65%,15%)]">
                  <TableHead className="text-white font-accent">{strings.metricCol}</TableHead>
                  <TableHead className="text-white font-accent text-right">{strings.year1Col}</TableHead>
                  <TableHead className="text-white font-accent text-right">{strings.year3Col}</TableHead>
                  <TableHead className="text-white font-accent text-right">{strings.year5Col}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.map((row, i) => (
                  <TableRow key={row.label} className={i % 2 === 1 ? "bg-[hsl(210,25%,97%)]" : "bg-white"}>
                    <TableCell className="font-body font-medium text-[hsl(210,65%,15%)]">{row.label}</TableCell>
                    <TableCell className={`text-right font-body ${row.isDilution ? dilutionColor(y1.dilution) : ""}`}>{row.y1}</TableCell>
                    <TableCell className={`text-right font-body ${row.isDilution ? dilutionColor(y3.dilution) : ""}`}>{row.y3}</TableCell>
                    <TableCell className={`text-right font-body ${row.isDilution ? dilutionColor(y5.dilution) : ""}`}>{row.y5}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Insights */}
      <InsightsPanel strings={strings} params={params} result={result} />

      {/* Footer strip */}
      <div className="text-center py-6 border-t border-border/50">
        <p className="text-sm font-body text-muted-foreground mb-1">{strings.footerBuiltFor}</p>
        <p className="text-sm font-body text-muted-foreground">
          {strings.footerArticleCTA}{" "}
          <a href={articleLinks[lang]} className="text-[hsl(200,100%,55%)] underline hover:no-underline">
            {strings.footerArticleLink}
          </a>
        </p>
      </div>
    </div>
  )
}
