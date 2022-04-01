import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text, Radio, Button, Input } from '@tarojs/components';
import logo from '../../static/login/li-without-border.png';
import { COUNT_DOWN } from '../../utils/constants';

import './index.less';
import { reqAddUser, reqUserCurrent } from './service';

const Login = ()=>{

  const [ isChecked, setIsChecked ] = useState(true);  // 是否同意协议
  const [ inputUsername, setInputUsername ] = useState('');  // 接收输入的用户名
  const [ verificationCode, setVerificationCode ] = useState('');  // 随机生成的验证码
  const [ inputVerificationCode, setInputVerificationCode ] = useState('');  // 接收用户输入的验证码
  const [ btnText, setBtnText ] = useState('获取验证码');  // 设置获取验证码按钮的文案
  const [ isDisable, setIsDisable ] = useState(false);  // 设置获取验证码按钮是否禁用
  const [ timer, setTimer ] = useState(0);  // 设置验证码定时器的 id
  
  const userObj_from_storage = Taro.getStorageSync('userObj');
  const userId_from_storage = Taro.getStorageSync('userId');

  // 如果缓存中有用户信息，则直接进入主页
  if(userId_from_storage&&userObj_from_storage) {
    // 跳转到首页
    Taro.switchTab({  
      url:'../index/index'
    });
  }
  
  // 点击是否同意注册、隐私协议
  const changeChecked = () => {
    console.log(1111);
    setIsChecked(!isChecked);
  };

  // 获取用户输入的账号：手机号
  const getUsername = (e) => {
    // 判断手机号的正则表达式
    const reg = new RegExp('(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\\d{8}', 'g');
    const reg_result = reg.exec(e.detail.value);
   
    if (reg_result) {  // 正确匹配
      setInputUsername(e.detail.value);  
    } else {
      Taro.showToast({
        title: '手机号格式错误',
        icon: 'error',
        duration: 1000
      });
    }
  };

  // 点击获取验证码，并调用云函数发送含验证码的信息到用户手机上
  const getVerificationCode = () => {
    if(inputUsername === '' ){
      Taro.showToast({
        title: '请先输入手机号！',
        icon: 'error',
        duration: 1000
      });
      return;
    }
    var count_down = COUNT_DOWN;  // 常量重新赋值，下方需改变
    const timer1 = setInterval(() => {
      setTimer(timer1);  // 更新定时器 id

      console.log(count_down);
      if (count_down > 0) {
        document.getElementById('verification-btn').style.color='#b3b3cc';  // 设置按钮点击后的颜色
        count_down= count_down - 1;
        setBtnText('重新获取' + count_down);
        setIsDisable(true);  // 设置按钮无法被点击
      }
      else {
        document.getElementById('verification-btn').style.color='#2b69dd';  // 设置按钮原本的颜色
        setBtnText('获取验证码');
        setIsDisable(false);  // 设置按钮可被点击
        clearInterval(timer);
      }
    }, 1000);

    const code = getRandomCode(6);  // 得到6位数的验证码
    console.log(code);
    setVerificationCode(code);
    // 调用云函数向用户发送验证码
    Taro.cloud.callFunction({
      name: 'sendMessage',
      data: {
        phone: inputUsername,
        code: code 
      }
    }).then(res=>{
      console.log('成功', res);
    }).catch(res=>{
      console.log('失败', res);
    });
  };

  // 生成随机验证码
  const getRandomCode = (n) => {
    const chars = ['1','2','3','4','5','6','7','8','9','0'];
    var res = '';
    for(let i=0; i<n; i++){
      var id = Math.ceil(Math.random()*9);
      res += chars[id];
    }
    return res;
  };

  // 获取用户输入的验证码
  const getInputCode = (e) => {
    console.log(e.detail.value);
    setInputVerificationCode(e.detail.value);
  };

  // 点击登录的回调
  const login = async () => {
    if(inputUsername === '' ){  // 判断手机号是否为空
      Taro.showToast({
        title: '请输入手机号！',
        icon: 'error',
        duration: 1000
      });
      return;
    }
    if(inputVerificationCode === '' ){  // 判断验证码是否为空
      Taro.showToast({
        title: '请输入验证码！',
        icon: 'error',
        duration: 1000
      });
      return;
    }
    if( isChecked === false) {
      Taro.showToast({
        title: '请同意相关协议',
        icon: 'error',
        duration: 1000
      });
      return;
    };
    if(inputVerificationCode !== '' && inputVerificationCode === verificationCode ){
      // 清除验证码 倒计时 定时器
      clearInterval(timer); 
      
      // 2. 提交添加的请求
      const userObj = {
        username: inputUsername,
        head_portrait: [], // 用户头像
        realname: '', // 姓名
        ID_number: '', // 身份证号
        address: '', // 住址
        profession: '', // 职业 
        realname_authentication: '未完成', // 是否已完成实名认证
      };
      const result = await reqAddUser(userObj);
      
      if(result.status === 1) { // 当前登录的用户已经存在
        // 获取全部用户信息后再保存
        const current_user_result = await reqUserCurrent(inputUsername);
        if(current_user_result.status === 0) {
          // 保存用户信息
          try {
            const { _id } = current_user_result.data[0];
            Taro.setStorageSync('userObj', current_user_result.data[0]);
            Taro.setStorageSync('userId', _id);

          } catch (e) { 
            console.log(e);
          }
        }
      } else if(result.status === 0) { // 当前登录的用户不存在
        // 直接保存用户信息（用户名存在，其他字段均为空）
        try {
          const { _id } = result.data;
          Taro.setStorageSync('userObj',result.data);
          Taro.setStorageSync('userId', _id);
        } catch (e) { 
          console.log(e);
        }
      }

      // 跳转到首页
      Taro.switchTab({  
        url:'../index/index'
      });
    } else {
      Taro.showToast({
        title: '验证码错误！',
        icon: 'error',
        duration: 1000
      });
    }
    
  };

  // useEffect(() => {
  //   return () => {
  //     clearInterval(timer);
  //   };
  // });

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
      <View className='username'>
        <View className='username-text'>用户名：</View>
        <Input className='username-input' onBlur={getUsername} placeholder='请输入手机号'></Input>
      </View>
      <View className='verification'>
        <View className='verification-text'>验证码：</View>
        <Input className='verification-input' onBlur={getInputCode} placeholder='手机验证码'>
        </Input>
      </View>
      <Button id='verification-btn' className='verification-btn' disabled={isDisable} onClick={getVerificationCode}>{btnText}</Button>

      <Button className='login-btn' onClick={login}>登录</Button>

      <View className='notice'>提示：首次使用，点击登录后即可完成注册！</View>
    </View>
  );
};

export default Login;