import type { MessageList } from '@/types/messages'

import api from './client'

export const fetchMessages = async (): Promise<MessageList> => {
  return api.get('/messages')
}
