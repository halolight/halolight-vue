import api from './client'

import type { FileList } from '@/types/files'

export const fetchFiles = async (): Promise<FileList> => api.get('/files')
