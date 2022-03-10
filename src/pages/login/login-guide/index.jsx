import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text, Radio, Button } from '@tarojs/components';
import logo from '../../../static/login/li-without-border.png';
// import WXBizDataCrypt from '../../../utils/WXBizDataCrypt';

import './index.less';

const LoginGuide = () => {

  const [ isChecked, setIsChecked ] = useState('true');  // 是否同意协议
  // const [ userInfo, setUserInfo ] = useState([]);  // 存放用户信息
  // const [ hasUserInfo, setHasUserInfo ] = useState(false);  // 是否有用户信息

  const changeChecked = () => {
    console.log(1111);
    setIsChecked(!isChecked);
  };

  const getPhoneNumber = (e) => {
    console.log(e);
    const { encryptedData, iv } = e.detail;
    console.log(encryptedData, iv);
    Taro.login({
      success: res => {
        console.log('获取的code是', res.code);
        // Taro.request({
        //   url: 'https://api.weixin.qq.com/sns/jscode2session',
        //   data: {
        //     appid: 'wx78f66c81537bec1b',
        //     secret: '279dfd43ceed468e4d800e1ad4b3f257',
        //     js_code: res.code,
        //     encryptedData,
        //     iv
        //   },
        //   success: res1 => {
        //     console.log('999', res1.data);
        //     const { openid, session_key } = res1.data;
        //     WXBizDataCrypt(openid, session_key);
        //     const phonenumber = res1.data.phoneNumber;
        //     console.log('手机号是：', phonenumber);

        //   }
        // });
      }
    });
  };

  const login_register = () => {
    console.log(777);
    Taro.navigateTo({
      url:'../index'
    });
  };

  return(
    <View className='container'>
      <View className='logo-name'>
        <Image className='logo' src={logo}></Image>
        <View className='name'>筑城文体通</View>
      </View>
      <View className='slogan'>开&nbsp;&nbsp;始&nbsp;&nbsp;运&nbsp;&nbsp;动，迈&nbsp;&nbsp;向&nbsp;&nbsp;健&nbsp;&nbsp;康</View>
      <View className='agreement'>
        <Radio className='check-agreement' checked={isChecked} onClick={changeChecked}></Radio>
        <Text className='agreement-left'>我已阅读并同意</Text>
        <Text className='agreement-right'>用户注册协议、隐私协议</Text>
      </View>
      <Button className='wechat-login' open-type='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>微信用户一键登录</Button>
      <View className='phone-login' onClick={login_register}>输入手机号和密码注册/登录</View>
    </View>
  );
};

export default LoginGuide;