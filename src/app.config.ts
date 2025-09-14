export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/web/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro Harmony',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666666',
    selectedColor: '#007aff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/web/index',
        text: 'Web'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
