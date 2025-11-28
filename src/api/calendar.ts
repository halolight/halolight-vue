import api from './client'

import type { CalendarEvents } from '@/types/calendar'

export const fetchCalendarEvents = async (): Promise<CalendarEvents> => api.get('/calendar/events')
