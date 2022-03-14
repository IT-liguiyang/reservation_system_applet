/* eslint-disable no-undef */

export default defineAppConfig({
  pages: [
    'pages/index/index',  // 小程序首页
    'pages/search/index',  // 搜索页面
    'pages/news/index',  // 新闻首页
    'pages/login/index',  // 登录
    'pages/login/login-guide/index',  // 我的首页
    'pages/user/index',  // 我的首页
    'pages/dynamic/index',  // 动态首页
    // 'pages/reservation/index',  // 预约首页
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
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
        pagePath: 'pages/news/index',
        iconPath: './static/tabBar/news.png',
        selectedIconPath: './static/tabBar/news-blue.png',
        text:'新闻'
      },
      {
        pagePath: 'pages/dynamic/index',
        iconPath: './static/tabBar/dynamic.png',
        selectedIconPath: './static/tabBar/dynamic-blue.png',
        text:'动态'
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
