/*
能发送异步ajax请求的函数模块

函数的返回值是promise对象
1. 优化1: 统一处理请求异常?
    在外层包一个自己创建的promise对象
    在请求出错时, 不reject(error), 而是显示错误提示
2. 优化2: 异步得到不是reponse, 而是response.data
   在请求成功resolve时: resolve(response.data)
 */

import Taro from '@tarojs/taro';
import config from './config';

export default (url, data={}, type='GET') => {

  return new Promise((resolve, reject) => {
    // 1. 执行异步请求
    Taro.request({
      url: config.host + url,
      data,
      method: type,
      // 2. 如果成功了, 调用resolve(value)
      success: (res) => {
        // if(data.isLogin){// 登录请求
        //   // 将用户的cookie存入至本地
        //   wx.setStorage({
        //     key: 'cookies',
        //     data: res.cookies
        //   })
        // }
        resolve(res.data); // resolve修改promise的状态为成功状态resolved
      },
      // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
      fail: (err) => {
        // console.log('请求失败: ', err);
        reject(err); // reject修改promise的状态为失败状态 rejected
      }
    });
  });
};