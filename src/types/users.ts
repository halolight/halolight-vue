export interface UserItem {
  id: number
  name: string
  email: string
  role: string
  status: '活跃' | '禁用'
}

export interface UserList {
  list: UserItem[]
}
