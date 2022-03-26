// import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, Input, Textarea, Form } from '@tarojs/components';
import './index.less';

import { reqUpdateUser } from './service';

const PersonalInfo = () => {

  // 从缓存获取不会改变的 userId
  const userId = Taro.getStorageSync('userId');  
  // 从缓存获取 userObj
  const userObj_from_storage = Taro.getStorageSync('userObj');
  const { username, head_portrait, realname, ID_number, address, profession, realname_authentication } = userObj_from_storage || {};

  // 不用 useState，因为在 setXX 的时候会引起页面刷新，把其他输入框的值置空
  var idNumberFormat = ID_number ? true:false;
  
  const formSubmit = async (event) => {

    if(idNumberFormat === false) {
      Taro.showToast({
        title: '身份证格式错误',
        icon: 'error',
        duration: 1000
      });
      return;
    }
    // 1.得到输入的地址和职业
    const { input_realname, input_ID_number, input_address, input_profession } = event.detail.value;
    
    // 2.构造更新的对象
    const userObj = {
      username,
      head_portrait, 
      realname: realname || input_realname, 
      ID_number: ID_number || input_ID_number, 
      address: input_address, 
      profession: input_profession,
      realname_authentication
    };

    // 3.发送请求 更新数据库中的头像信息
    const result = await reqUpdateUser({userObj, userId});
    console.log(result);

    if(result.status === 0) {
      try {
        Taro.removeStorageSync('userObj');
        Taro.setStorageSync('userObj', {userId, ...userObj});
      } catch (e) {
        console.log(e);
      }
   
      Taro.showToast({
        title: '修改成功！',
        icon: 'success'
      });

      setTimeout(() => {
        // 使跳转后自动重新获取数据
        Taro.switchTab({
          url: '../index',
          success:  () => { 
            // 认证成功，跳转至个人信息首页后需要刷新页面，否则无法拿到最新的信息
            const page = Taro.getCurrentPages().pop();
            page.onLoad(); 
          } 
        });
        
      }, 1500);
    }
  };

  const judgeForIdNumber = (e) => {

    console.log(e.detail.value);
    const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    const reg_result = reg.test(e.detail.value);
   
    if (reg_result) {  // 正确匹配
      // setIdNumberFormat(true);  
      idNumberFormat = true;
    } else {
      Taro.showToast({
        title: '身份证格式错误',
        icon: 'error',
        duration: 1000
      });
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
          <Input name='input_realname' value={realname} className='input' disabled={realname && idNumberFormat === true ? true:false}></Input>
        </View>
        <View className='personal-info-item'>
          <Text className='title'>身份证号：</Text>
          <Input name='input_ID_number' value={ID_number} className='input' onBlur={judgeForIdNumber} disabled={ID_number ? true:false}></Input>
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