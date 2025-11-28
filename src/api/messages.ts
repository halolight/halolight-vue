import api from './client'

import type { MessageList } from '@/types/messages'

export const fetchMessages = async (): Promise<MessageList> => {
  return api.get('/messages')
}
