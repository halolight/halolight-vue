export interface MessageSender {
  id: string
  name: string
  avatar?: string
}

export interface MessageItem {
  id: string
  sender: MessageSender
  content: string
  createdAt: string
  read: boolean
}

export interface MessageList {
  list: MessageItem[]
  total: number
}
