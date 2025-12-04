export interface UserRole {
  id: string
  name: string
  label: string
  permissions: string[]
}

export interface UserItem {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: UserRole
  status: 'active' | 'inactive' | 'suspended'
  department?: string
  position?: string
  createdAt: string
  lastLoginAt?: string
}

export interface UserList {
  list: UserItem[]
  total: number
  page?: number
  pageSize?: number
}
