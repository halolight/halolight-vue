import type { CalendarEvents } from '@/types/calendar'

import api from './client'

export const fetchCalendarEvents = async (): Promise<CalendarEvents> => api.get('/calendar/events')
