import { cn } from "@/lib/utils"
import { formatNumber } from "./engine"

interface MetricCardProps {
  label: string
  value: number
  tokenName: string
  isPercentage?: boolean
  colorCode?: "dilution"
}

export default function MetricCard({ label, value, tokenName, isPercentage, colorCode }: MetricCardProps) {
  let valueColor = "text-[hsl(210,65%,15%)]" // navy
  if (colorCode === "dilution") {
    const abs = Math.abs(value)
    if (abs > 10) valueColor = "text-red-600"
    else if (abs > 5) valueColor = "text-amber-600"
    else valueColor = "text-emerald-600"
  }

  const displayValue = isPercentage
    ? `${value.toFixed(2)}%`
    : `${formatNumber(value)} ${tokenName}`

  return (
    <div className="bg-white rounded-xl border-l-[3px] border-l-[hsl(200,100%,55%)] shadow-card p-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
      <p className="text-sm font-body text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-2xl font-hero font-bold", valueColor)}>{displayValue}</p>
    </div>
  )
}
