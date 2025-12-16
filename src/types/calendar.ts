export interface CalendarEvent {
  id: number
  title: string
  date: string
  type: '会议' | '发布' | '提醒'
}

export interface CalendarEvents {
  list: CalendarEvent[]
}
