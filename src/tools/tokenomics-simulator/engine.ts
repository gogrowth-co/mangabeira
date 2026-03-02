export interface SimulationParams {
  tokenName: string
  maxSupply: number
  emissionRate: number   // 0-100
  lockupMonths: number   // 0-36
  stakingParticipation: number // 0-100
  stakingAPY: number     // 0-100
  burnRate: number       // 0-50
}

export interface YearData {
  year: number
  circulatingSupply: number
  staked: number
  rewards: number
  burned: number
  dilution: number
  cumulativeBurned: number
}

export interface SimulationResult {
  yearlyData: YearData[]
  year1Metrics: {
    circulatingSupply: number
    staked: number
    rewards: number
    burned: number
    netChange: number
    dilution: number
  }
  supplyDistribution: {
    staked: number
    circulating: number
    burned: number
  }
}

export const DEFAULT_PARAMS: SimulationParams = {
  tokenName: "TOKEN",
  maxSupply: 1_000_000_000,
  emissionRate: 10,
  lockupMonths: 6,
  stakingParticipation: 40,
  stakingAPY: 12,
  burnRate: 2,
}

export function simulateTokenomics(params: SimulationParams): SimulationResult {
  const { maxSupply, emissionRate, stakingParticipation, stakingAPY, burnRate } = params
  const emR = emissionRate / 100
  const stP = stakingParticipation / 100
  const stA = stakingAPY / 100
  const buR = burnRate / 100

  let prevSupply = maxSupply * 0.2 // Initial circulating = 20%
  let cumulativeBurned = 0
  const yearlyData: YearData[] = []

  for (let year = 1; year <= 5; year++) {
    const emission = prevSupply * emR
    const staked = prevSupply * stP
    const rewards = staked * stA
    const burned = prevSupply * buR
    const netChange = emission + rewards - burned
    const newSupply = Math.min(prevSupply + netChange, maxSupply)
    const dilution = prevSupply > 0 ? ((newSupply - prevSupply) / prevSupply) * 100 : 0
    cumulativeBurned += burned

    yearlyData.push({
      year,
      circulatingSupply: newSupply,
      staked: newSupply * stP,
      rewards,
      burned,
      dilution,
      cumulativeBurned,
    })

    prevSupply = newSupply
  }

  const y1 = yearlyData[0]
  const y5 = yearlyData[4]

  return {
    yearlyData,
    year1Metrics: {
      circulatingSupply: y1.circulatingSupply,
      staked: y1.staked,
      rewards: y1.rewards,
      burned: y1.burned,
      netChange: y1.circulatingSupply - maxSupply * 0.2,
      dilution: y1.dilution,
    },
    supplyDistribution: {
      staked: y5.staked,
      circulating: y5.circulatingSupply - y5.staked,
      burned: y5.cumulativeBurned,
    },
  }
}

export function formatNumber(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? "-" : ""
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(2)}K`
  return `${sign}${abs.toFixed(0)}`
}

export function parseSupply(input: string): number {
  const cleaned = input.trim().toUpperCase().replace(/,/g, "")
  const match = cleaned.match(/^([\d.]+)\s*([KMB]?)$/)
  if (!match) return DEFAULT_PARAMS.maxSupply
  const num = parseFloat(match[1])
  if (isNaN(num)) return DEFAULT_PARAMS.maxSupply
  switch (match[2]) {
    case "B": return num * 1_000_000_000
    case "M": return num * 1_000_000
    case "K": return num * 1_000
    default: return num
  }
}

export function formatSupplyInput(n: number): string {
  if (n >= 1_000_000_000 && n % 1_000_000_000 === 0) return `${n / 1_000_000_000}B`
  if (n >= 1_000_000 && n % 1_000_000 === 0) return `${n / 1_000_000}M`
  if (n >= 1_000 && n % 1_000 === 0) return `${n / 1_000}K`
  return n.toString()
}

export function encodeParamsToURL(params: SimulationParams): string {
  const p = new URLSearchParams()
  p.set("name", params.tokenName)
  p.set("supply", params.maxSupply.toString())
  p.set("emission", params.emissionRate.toString())
  p.set("lockup", params.lockupMonths.toString())
  p.set("staking", params.stakingParticipation.toString())
  p.set("apy", params.stakingAPY.toString())
  p.set("burn", params.burnRate.toString())
  return p.toString()
}

export function decodeParamsFromURL(): SimulationParams | null {
  const p = new URLSearchParams(window.location.search)
  if (!p.has("emission") && !p.has("name")) return null
  return {
    tokenName: p.get("name") || DEFAULT_PARAMS.tokenName,
    maxSupply: Number(p.get("supply")) || DEFAULT_PARAMS.maxSupply,
    emissionRate: Number(p.get("emission")) || DEFAULT_PARAMS.emissionRate,
    lockupMonths: Number(p.get("lockup")) ?? DEFAULT_PARAMS.lockupMonths,
    stakingParticipation: Number(p.get("staking")) || DEFAULT_PARAMS.stakingParticipation,
    stakingAPY: Number(p.get("apy")) || DEFAULT_PARAMS.stakingAPY,
    burnRate: Number(p.get("burn")) ?? DEFAULT_PARAMS.burnRate,
  }
}

export const PRESETS: Record<string, Omit<SimulationParams, "tokenName" | "maxSupply">> = {
  conservative: { emissionRate: 5, lockupMonths: 12, stakingParticipation: 60, stakingAPY: 8, burnRate: 1 },
  growth: { emissionRate: 15, lockupMonths: 6, stakingParticipation: 40, stakingAPY: 15, burnRate: 3 },
  aggressive: { emissionRate: 25, lockupMonths: 3, stakingParticipation: 30, stakingAPY: 25, burnRate: 2 },
  deflationary: { emissionRate: 8, lockupMonths: 9, stakingParticipation: 50, stakingAPY: 10, burnRate: 10 },
}
