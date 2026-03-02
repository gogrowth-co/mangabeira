import { SlidersHorizontal, Shield, TrendingUp, Rocket, Diamond } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import type { SimulatorStrings } from "./strings"
import type { SimulationParams } from "./engine"
import { formatSupplyInput, parseSupply, PRESETS } from "./engine"

interface ConfigPanelProps {
  strings: SimulatorStrings
  params: SimulationParams
  activePreset: string | null
  onParamsChange: (params: Partial<SimulationParams>) => void
  onPreset: (key: string) => void
  onReset: () => void
}

const presetIcons: Record<string, React.ReactNode> = {
  conservative: <Shield className="h-4 w-4" />,
  growth: <TrendingUp className="h-4 w-4" />,
  aggressive: <Rocket className="h-4 w-4" />,
  deflationary: <Diamond className="h-4 w-4" />,
}

const presetNameKeys: Record<string, keyof SimulatorStrings> = {
  conservative: "presetConservative",
  growth: "presetGrowth",
  aggressive: "presetAggressive",
  deflationary: "presetDeflationary",
}

interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix: string
  onChange: (v: number) => void
}

function SliderRow({ label, value, min, max, step = 1, suffix, onChange }: SliderRowProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-body font-medium text-[hsl(0,0%,20%)]">{label}</label>
      <div className="flex items-center gap-3">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([v]) => onChange(v)}
          className="flex-1"
        />
        <div className="relative w-[72px]">
          <Input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={e => {
              const v = Number(e.target.value)
              if (!isNaN(v) && v >= min && v <= max) onChange(v)
            }}
            className="w-full pr-7 text-sm h-9 border-[hsl(210,65%,15%)]/20 rounded-md"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ConfigPanel({ strings, params, activePreset, onParamsChange, onPreset, onReset }: ConfigPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 space-y-6">
      <h2 className="text-lg font-hero font-semibold text-[hsl(210,65%,15%)] flex items-center gap-2">
        <SlidersHorizontal className="h-[18px] w-[18px] text-[hsl(200,100%,55%)]" />
        {strings.configTitle}
      </h2>

      {/* Token Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-body font-medium text-[hsl(0,0%,20%)]">{strings.tokenNameLabel}</label>
        <Input
          value={params.tokenName}
          onChange={e => onParamsChange({ tokenName: e.target.value.toUpperCase() })}
          placeholder={strings.tokenNamePlaceholder}
          className="uppercase border-[hsl(210,65%,15%)]/20"
        />
      </div>

      {/* Max Supply */}
      <div className="space-y-1.5">
        <label className="text-sm font-body font-medium text-[hsl(0,0%,20%)]">{strings.maxSupplyLabel}</label>
        <Input
          defaultValue={formatSupplyInput(params.maxSupply)}
          onBlur={e => {
            const parsed = parseSupply(e.target.value)
            onParamsChange({ maxSupply: parsed })
            e.target.value = formatSupplyInput(parsed)
          }}
          className="border-[hsl(210,65%,15%)]/20"
        />
        <p className="text-xs text-muted-foreground font-body">{strings.maxSupplyHelper}</p>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <label className="text-sm font-body font-medium text-[hsl(0,0%,20%)]">{strings.presetsLabel}</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(PRESETS).map(key => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => onPreset(key)}
              className={`relative z-10 text-xs font-accent justify-start gap-1.5 transition-all duration-200 ${
                activePreset === key
                  ? "border-[hsl(45,100%,50%)] border-2 text-[hsl(200,100%,55%)]"
                  : "border-[hsl(210,65%,15%)]/20 text-[hsl(210,65%,15%)] hover:border-[hsl(200,100%,55%)] hover:text-[hsl(200,100%,55%)]"
              }`}
            >
              {presetIcons[key]}
              {strings[presetNameKeys[key]]}
            </Button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        <SliderRow
          label={strings.emissionLabel}
          value={params.emissionRate}
          min={0} max={100}
          suffix="%"
          onChange={v => onParamsChange({ emissionRate: v })}
        />
        <SliderRow
          label={strings.lockupLabel}
          value={params.lockupMonths}
          min={0} max={36}
          suffix="mo"
          onChange={v => onParamsChange({ lockupMonths: v })}
        />
        <SliderRow
          label={strings.stakingLabel}
          value={params.stakingParticipation}
          min={0} max={100}
          suffix="%"
          onChange={v => onParamsChange({ stakingParticipation: v })}
        />
        <SliderRow
          label={strings.apyLabel}
          value={params.stakingAPY}
          min={0} max={100}
          suffix="%"
          onChange={v => onParamsChange({ stakingAPY: v })}
        />
        <SliderRow
          label={strings.burnLabel}
          value={params.burnRate}
          min={0} max={50}
          suffix="%"
          onChange={v => onParamsChange({ burnRate: v })}
        />
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="text-xs font-body text-[hsl(200,100%,55%)] hover:underline transition-colors"
      >
        {strings.resetLabel}
      </button>
    </div>
  )
}
