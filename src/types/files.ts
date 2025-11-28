export interface FileItem {
  id: string
  name: string
  size: string
  owner: string
  updatedAt: string
}

export interface FileList {
  list: FileItem[]
}
