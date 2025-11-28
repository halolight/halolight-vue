import Mock from 'mockjs'

const files = Mock.mock({
  'list|6': [
    {
      id: '@guid()',
      name: '@ctitle(4, 10).md',
      size: () => `${Mock.Random.integer(20, 900)} KB`,
      owner: '@cname() '
        .trim(),
      updatedAt: '@date("yyyy-MM-dd")',
    },
  ],
}).list

export const registerFileMocks = () => {
  Mock.mock(/\/api\/files/, 'get', { list: files })
}
