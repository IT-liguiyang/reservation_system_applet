// import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, Input, Form } from '@tarojs/components';
import './index.less';

import { reqUpdateUser } from './service';

const RealnameAuthentication = () => {

  // 从缓存获取不会改变的 userId
  const userId = Taro.getStorageSync('userId');  
  // 从缓存获取 userObj
  const userObj_from_storage = Taro.getStorageSync('userObj');
  const { username, head_portrait, realname, ID_number, address, profession, realname_authentication } = userObj_from_storage || {};
  console.log('886', realname_authentication);
  const formSubmit = async (event) => {

    if(realname_authentication === '未完成') {
      const { input_realname, input_ID_number } = event.detail.value;
      console.log(input_realname, input_ID_number);

      const userObj = {
        username,
        head_portrait, 
        realname, 
        ID_number, 
        address, 
        profession,
        realname_authentication: '已完成'
      };
  
      // 3.发送请求 更新数据库中的头像信息
      const result = await reqUpdateUser({userObj, userId});
      console.log(result);
  
      try {
        Taro.removeStorageSync('userObj');
        Taro.setStorageSync('userObj', {userId, ...userObj});
      } catch (e) {
        console.log(e);
      }

      Taro.showToast({
        title: '认证成功',
        icon: 'success',
        duration: 2000
      });
  
      Taro.switchTab({ 
        url: '../index', 
        success:  () => { 
          // 认证成功，跳转至个人中心首页后需要刷新页面，否则 realname_authentication 无法拿到最新的值
          const page = Taro.getCurrentPages().pop();
          page.onLoad(); 
        } 
      });
    }
  };

  return(
    realname_authentication === '未完成' ? (
      <View className='personal'>
        <View className='personal-authentication-title'>请完成实名认证</View>
        <View className='personal-authentication-subtitle'>信息仅用于实名认证，平台将保障您的信息安全</View>
        <View className='personal-authentication-form-title'>身份信息</View>
        <Form className='personal-authentication' onSubmit={formSubmit}>
          <View className='personal-authentication-item'>
            <Text className='title'>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</Text>
            <Input name='input_realname' className='input'></Input>
          </View>
          <View className='personal-authentication-item'>
            <Text className='title'>身份证号：</Text>
            <Input name='input_ID_number' className='input'></Input>
          </View>
          <Button id='submit-btn' className='submit-btn' form-type='submit'>提&nbsp;&nbsp;交</Button>
        </Form>
      </View>
    ):(
      <View className='personal'>
        <View className='personal-authentication-top'>
          <Text className='iconfont icon-renwuzhongxin-shimingrenzheng'></Text>
          <View className='personal-authentication-top title'>您已通过实名认证</View>
        </View>
        <Form className='personal-authentication'>
          <View className='personal-authentication-item'>
            <Text className='title'>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</Text>
            <Input name='input_realname' value={realname} className='input' style={{backgroundColor:'white'}} disabled></Input>
          </View>
          <View className='personal-authentication-item'>
            <Text className='title'>身份证号：</Text>
            <Input name='input_ID_number' value={ID_number} className='input' style={{backgroundColor:'white'}} disabled></Input>
          </View>
        </Form>
      </View>
    )
  );
};

export default RealnameAuthentication;