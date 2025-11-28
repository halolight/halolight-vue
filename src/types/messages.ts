export interface MessageItem {
  id: number
  title: string
  sender: string
  time: string
  status: string
}

export interface MessageList {
  list: MessageItem[]
}
