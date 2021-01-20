module.exports = {
  title: '二狗',
  theme: 'reco',
  description: '不忘初心，方得始终',
  head: [[('link', { rel: 'shortcut icon', href: '/image/dog.png' })], ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]],
  themeConfig: {
    type: 'blog',
    authorAvatar: '/image/avatar.jpeg',
    // 博客配置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: '分类', // 默认文案 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: '标签', // 默认文案 “标签”
      },
      socialLinks: [
        // 信息栏展示社交信息
        { icon: 'reco-github', link: 'https://github.com/VirusYu' },
      ],
      // 项目开始时间，只填写年份
      startYear: '2021',
      author: '二狗',
    },
  },
}
