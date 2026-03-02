import { AlertTriangle, Info, CheckCircle, Lightbulb } from "lucide-react"
import type { SimulatorStrings } from "./strings"
import type { SimulationParams, SimulationResult } from "./engine"

interface InsightsPanelProps {
  strings: SimulatorStrings
  params: SimulationParams
  result: SimulationResult
}

interface Insight {
  type: "amber" | "aqua" | "green"
  title: string
  body: string
}

export default function InsightsPanel({ strings, params, result }: InsightsPanelProps) {
  const insights: Insight[] = []

  // Amber warnings
  if (params.emissionRate > 20) {
    insights.push({ type: "amber", title: strings.insightHighEmissionTitle, body: strings.insightHighEmission })
  }
  if (params.stakingParticipation < 30) {
    insights.push({ type: "amber", title: strings.insightLowStakingTitle, body: strings.insightLowStaking })
  }
  if (result.year1Metrics.dilution > 15) {
    insights.push({ type: "amber", title: strings.insightHighDilutionTitle, body: strings.insightHighDilution })
  }

  // Aqua info
  if (params.lockupMonths < 3) {
    insights.push({ type: "aqua", title: strings.insightShortLockupTitle, body: strings.insightShortLockup })
  }

  // Green positive
  if (params.burnRate >= 5 && params.emissionRate <= params.burnRate * 2) {
    insights.push({ type: "green", title: strings.insightDeflationaryTitle, body: strings.insightDeflationary })
  }
  if (params.emissionRate <= 15 && params.stakingParticipation >= 40 && params.burnRate >= 2 && params.lockupMonths >= 6) {
    insights.push({ type: "green", title: strings.insightBalancedTitle, body: strings.insightBalanced })
  }

  const styleMap = {
    amber: {
      bg: "bg-[rgba(251,191,36,0.08)]",
      border: "border-l-amber-400",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />,
    },
    aqua: {
      bg: "bg-[rgba(31,182,255,0.08)]",
      border: "border-l-[hsl(200,100%,55%)]",
      icon: <Info className="h-5 w-5 text-[hsl(200,100%,55%)] shrink-0 mt-0.5" />,
    },
    green: {
      bg: "bg-[rgba(16,185,129,0.08)]",
      border: "border-l-emerald-500",
      icon: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />,
    },
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h3 className="text-lg font-hero font-semibold text-[hsl(210,65%,15%)] flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-[hsl(45,100%,50%)]" />
        {strings.insightsTitle}
      </h3>

      {insights.length === 0 ? (
        <div className="bg-muted/50 rounded-lg border-l-[3px] border-l-muted-foreground/30 p-4">
          <p className="text-sm font-body text-muted-foreground">{strings.insightNeutral}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, i) => {
            const s = styleMap[insight.type]
            return (
              <div key={i} className={`${s.bg} rounded-lg border-l-[3px] ${s.border} p-4 flex gap-3`}>
                {s.icon}
                <div>
                  <p className="text-sm font-hero font-semibold text-[hsl(210,65%,15%)] mb-1">{insight.title}</p>
                  <p className="text-sm font-body text-[hsl(0,0%,20%)]">{insight.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
