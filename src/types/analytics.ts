export interface AnalyticsSummary {
  kpis: { label: string; value: string; change: string }[]
  traffic: { source: string; value: number }[]
  regions: { name: string; users: number }[]
}
