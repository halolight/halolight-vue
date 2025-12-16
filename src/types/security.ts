export interface SecurityIssue {
  id: number
  title: string
  severity: '低' | '中' | '高'
  status: '已修复' | '待处理'
}

export interface SecurityReport {
  issues: SecurityIssue[]
  lastScan: string
  score: number
}
