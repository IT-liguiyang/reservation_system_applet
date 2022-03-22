// import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, Input, Textarea, Form } from '@tarojs/components';
import './index.less';

import { reqUpdateUser } from './service';
// import { BASE_IMG_URL } from '../../utils/constants';

const PersonalInfo = () => {

  // 从缓存获取不会改变的 userId
  const userId = Taro.getStorageSync('userId');  
  // 从缓存获取 userObj
  const userObj_from_storage = Taro.getStorageSync('userObj');
  const { username, head_portrait, realname, ID_number, address, profession, realname_authentication } = userObj_from_storage || {};

  const formSubmit = async (event) => {
    // 1.得到输入的地址和职业
    const { input_address, input_profession } = event.detail.value;
    
    // 2.构造更新的对象
    const userObj = {
      username,
      head_portrait, 
      realname, 
      ID_number, 
      address: input_address, 
      profession: input_profession,
      realname_authentication
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
  };

  return(
    <View className='personal'>
      <Form className='personal-info' onSubmit={formSubmit}>
        <View className='personal-info-item'>
          <Text className='title'>手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：</Text>
          <Input name='input_username' value={username} className='input' disabled></Input>
        </View>
        <View className='personal-info-item'>
          <Text className='title'>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</Text>
          <Input name='input_realname' value={realname} className='input'></Input>
        </View>
        <View className='personal-info-item'>
          <Text className='title'>身份证号：</Text>
          <Input name='input_ID_number' value={ID_number} className='input'></Input>
        </View>
        <View className='personal-info-item'>
          <Text className='title'>住&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：</Text>
          <Textarea name='input_address' value={address} className='textarea-input'></Textarea>
        </View>
        <View className='personal-info-item'>
          <Text className='title'>职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业：</Text>
          <Input name='input_profession' value={profession} className='input'></Input>
        </View>
        <View className='personal-info-item'>
          <Text className='title'>实名认证：</Text>
          <Input name='input_realname_authentication' value={realname_authentication} className='input' disabled></Input>
        </View>
        <Button className='submit-btn' form-type='submit'>提&nbsp;&nbsp;交</Button>
      </Form>
      <View className='notice'>提示：重新输入后点击提交即可修改个人信息！</View>
    </View>
  );
};

export default PersonalInfo;