/* eslint-disable no-undef */

export default defineAppConfig({
  pages: [
    'pages/login/index',  // 登录

    'pages/index/index',  // 小程序首页

    'pages/reservation/index',  // 预约首页
    'pages/reservation/reservation-form/index',  // 预约首页-预约表单

    'pages/news-list/index',  // 新闻首页
    'pages/news/index',  // 新闻详情首页

    'pages/school-list/index',  // 学校列表首页
    'pages/school/index',  // 学校详情首页

    'pages/dynamic/index',  // 动态首页
    'pages/dynamic/publish/index',  // 动态首页

    'pages/search/index',  // 搜索页面
    
    'pages/user/index',  // 我的首页
    'pages/user/my-reservation/index',  // 我的首页-我的预约
    'pages/user/my-reservation/comment/index',  // 我的首页-我的预约-发布评价
    'pages/user/my-message/index',  // 我的首页-我的消息
    'pages/user/personal-info/index',  // 我的首页-个人信息
    'pages/user/realname-authentication/index',  // 我的首页-实名认证
    'pages/user/my-dynamic/index',  // 我的首页-我的动态
    'pages/user/common-problems/index',  // 我的首页-常见问题
    'pages/user/about-us/index',  // 我的首页-关于我们
    'pages/user/feedback/index',  // 我的首页-意见反馈
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
        pagePath: 'pages/news-list/index',
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
  },
  plugins: {
    routePlan: {
      version: '1.0.19',
      provider: 'wx50b5593e81dd937a'
    }
  },
  permission: {
    'scope.userLocation': {
      desc: '系统将获取您的定位用于线路规划'
    }
  }
});
