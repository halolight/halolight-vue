import Mock from 'mockjs'

const Random = Mock.Random

const fileTypes = ['folder', 'image', 'video', 'audio', 'document', 'archive', 'other']
const mimeTypes: Record<string, string> = {
  folder: 'folder',
  image: 'image/png',
  video: 'video/mp4',
  audio: 'audio/mp3',
  document: 'application/pdf',
  archive: 'application/zip',
  other: 'application/octet-stream',
}
const extensions: Record<string, string[]> = {
  folder: [''],
  image: ['.png', '.jpg', '.gif', '.webp'],
  video: ['.mp4', '.mov', '.avi'],
  audio: ['.mp3', '.wav', '.flac'],
  document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  archive: ['.zip', '.rar', '.7z'],
  other: ['.bin', '.dat'],
}

export const registerFileMocks = () => {
  // 获取文件列表
  Mock.mock(/\/api\/files(\?.*)?$/, 'get', () => {
    const count = Random.integer(10, 30)
    const list = []
    for (let i = 0; i < count; i++) {
      const type = Random.pick(fileTypes)
      const ext = type === 'folder' ? '' : Random.pick(extensions[type])
      list.push({
        id: Random.guid(),
        name: type === 'folder' ? Random.ctitle(2, 6) : Random.ctitle(2, 6) + ext,
        type,
        size: type === 'folder' ? null : Random.integer(1024, 104857600),
        items: type === 'folder' ? Random.integer(0, 50) : null,
        path: '/' + Random.ctitle(2, 4),
        mimeType: mimeTypes[type],
        thumbnail: type === 'image' ? Random.image('80x80') : null,
        createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      })
    }
    return { code: 200, message: 'success', data: { list, total: list.length } }
  })

  // 存储信息
  Mock.mock('/api/files/storage', 'get', () => {
    const total = 10 * 1024 * 1024 * 1024 // 10GB
    const used = Random.integer(1, 8) * 1024 * 1024 * 1024
    return {
      code: 200,
      message: 'success',
      data: {
        used,
        total,
        breakdown: {
          images: Random.integer(100, 500) * 1024 * 1024,
          videos: Random.integer(500, 2000) * 1024 * 1024,
          audio: Random.integer(50, 200) * 1024 * 1024,
          documents: Random.integer(100, 300) * 1024 * 1024,
          archives: Random.integer(200, 800) * 1024 * 1024,
          others: Random.integer(50, 150) * 1024 * 1024,
        },
      },
    }
  })

  // 上传文件
  Mock.mock('/api/files/upload', 'post', () => ({
    code: 200,
    message: '上传成功',
    data: { id: Random.guid(), url: Random.image('200x200'), createdAt: new Date().toISOString() },
  }))

  // 删除文件
  Mock.mock(/\/api\/files\/[a-zA-Z0-9-]+$/, 'delete', () => ({
    code: 200,
    message: '删除成功',
    data: null,
  }))

  // 创建文件夹
  Mock.mock('/api/files/folder', 'post', () => ({
    code: 200,
    message: '创建成功',
    data: { id: Random.guid(), createdAt: new Date().toISOString() },
  }))
}
