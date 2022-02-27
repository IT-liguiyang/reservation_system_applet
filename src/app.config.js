/* eslint-disable no-undef */

export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/dynamic/index',
    'pages/news/index',
    'pages/user/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F6D561',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#0f0f0f',
    selectedColor: 'pink',
    backgroundColor: '#fafafa',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: './static/tabBar/home.png',
        selectedIconPath: './static/tabBar/home-blue.png',
        text:'首页'
      },
      {
        pagePath: 'pages/dynamic/index',
        iconPath: './static/tabBar/dynamic.png',
        selectedIconPath: './static/tabBar/dynamic-blue.png',
        text:'动态'
      },
      {
        pagePath: 'pages/news/index',
        iconPath: './static/tabBar/news.png',
        selectedIconPath: './static/tabBar/news-blue.png',
        text:'新闻'
      },
      {
        pagePath: 'pages/user/index',
        iconPath: './static/tabBar/user.png',
        selectedIconPath: './static/tabBar/user-blue.png',
        text:'我的'
      }
    ]
  }
});