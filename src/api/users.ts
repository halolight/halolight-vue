import api from './client'

import type { UserList } from '@/types/users'

export const fetchUsers = async (): Promise<UserList> => api.get('/users')
