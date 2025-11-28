import type { FileList } from '@/types/files'

import api from './client'

export const fetchFiles = async (): Promise<FileList> => api.get('/files')
