import type { UserList } from '@/types/users'

import api from './client'

export const fetchUsers = async (): Promise<UserList> => api.get('/users')
