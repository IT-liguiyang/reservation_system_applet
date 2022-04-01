import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.less';

import { reqUpdateUser } from './service';
import { BASE_IMG_URL } from '../../utils/constants';

const User = () => {

  const userId = Taro.getStorageSync('userId');  // 从缓存获取不会改变的 userId
  const [ new_username, SetUsername ] = useState();  // 头像
  const [ new_head_portrait, SetHeadPortrait ] = useState([]);  // 头像
  const [ new_realname, SetRealname ] = useState('');  // 姓名
  const [ new_ID_number, SetID_number ] = useState('');  // 身份证
  const [ new_address, SetAddress ] = useState('');  // 地址
  const [ new_profession, SetProfession ] = useState('');  // 职业
  const [ new_realname_authentication, SetRealnameAuthentication ] = useState('');  // 实名认证

  // 获取当前登录用户的信息
  const getUserInfo = async () => {
    // 从缓存得到当前登录的用户
    const userObj_from_storage = Taro.getStorageSync('userObj');
    const { username, head_portrait, realname, ID_number, address, profession, realname_authentication } = userObj_from_storage || {};
    console.log('777777', realname_authentication);
    SetUsername(username);
    SetHeadPortrait(head_portrait);
    SetRealname(realname);
    SetID_number(ID_number);
    SetAddress(address);
    SetProfession(profession);
    SetRealnameAuthentication(realname_authentication);

    // 当所有信息都完善时，就不显示 “点击完善信息” 按钮
    if (userId&&username&&realname&&ID_number&&address&&profession){
      document.getElementById('complete-information').style.display = 'none';
    }
    // 当完成实名认证时，就不显示 “未完成” 按钮
    if (new_realname_authentication === '已完成'){
      document.getElementById('realname-authentication').style.display = 'none';
    }
  };

  useEffect(() => {
    getUserInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [new_realname_authentication]);

  // 更换头像
  const addhead_portrait = async () => {

    Taro.chooseImage({
      success (res) {
        const tempFilePaths = res.tempFilePaths;
        
        Taro.uploadFile({
          url: 'http://localhost:5000/manage/img/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'image',
          async success(res1){
            const { status, data } = JSON.parse(res1.data);
            if ( status === 0 ){
              // 1.更新头像显示
              SetHeadPortrait([data.name]);

              // 2.构造用户对象，实际上只改变头像的名字，形如 image-1647701020379.png
              const userObj = {
                username: new_username,
                head_portrait: [data.name],  // data.name需转为数组
                realname: new_realname, 
                ID_number: new_ID_number, 
                address: new_address, 
                profession: new_profession,
                realname_authentication: new_realname_authentication
              };

              // 3.发送请求 更新数据库中的头像信息
              const result = await reqUpdateUser({userObj, userId});
              console.log(result);

              // 4.更新本地缓存
              try {
                Taro.removeStorageSync('userObj');
                Taro.setStorageSync('userObj', {userId, ...userObj});
              } catch (e) {
                console.log(e);
              }
            }
            
          }
        });
      }
    });
  };

  // 查看并完善和修改个人信息
  const personalInfo = () => {
    Taro.navigateTo({
      url:'./personal-info/index'
    });
  };

  // 查看实名认证
  const Certification = () => {
    Taro.navigateTo({
      url:'./realname-authentication/index'
    });
  };

  // 查看我的动态
  const myDynamic = () => {
    Taro.navigateTo({
      url:'./my-dynamic/index'
    });
  };

  // 查看常见问题
  const commonProblems = () => {
    Taro.navigateTo({
      url:'./common-problems/index'
    });
  };

  // 查看问题反馈
  const feedback = () => {
    Taro.navigateTo({
      url:'./feedback/index'
    });
  };

  // 查看关于我们
  const aboutUs = () => {
    Taro.navigateTo({
      url:'./about-us/index'
    });
  };

  // 退出登录
  const logout = () => {
    // 退出时清空缓存
    try {
      Taro.removeStorageSync('userId');
      Taro.removeStorageSync('userObj');
    } catch (e) {
      console.log(e);
    }
    Taro.redirectTo({
      url:'../login/index'
    });
  };

  return(
    <View className='personal'>
      <View className='personal-top'>
        {
          new_head_portrait[0] ? 
            (<Image className='personal-top-image' hoverStopPropagation='true' onClick={addhead_portrait} src={BASE_IMG_URL + new_head_portrait[0]}></Image>)
            :(<Text className='iconfont icon-morentouxiang' hoverStopPropagation='true' onClick={addhead_portrait}></Text>)
        }
        <Text className='personal-top-text'>{new_username||''}</Text>
      </View>
      <View className='personal-middle'>
        <Text className='personal-middle-reservation'>
          <Text className='iconfont icon-yuyue'></Text>
          <Text>我的预约</Text>
        </Text>
        <Text className='personal-middle-notice'>
          <Text className='iconfont icon-tongzhi'></Text>
          <Text>我的消息</Text>
        </Text>
      </View>
      <View className='personal-bottom'>
        <Text className='personal-bottom-item' onClick={personalInfo}>
          <Text className='title'>个人信息</Text>
          <Text className='complete-information' id='complete-information'>点击去完善</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item' onClick={Certification}>
          <Text className='title'>实名认证</Text>
          <Text className='realname-authentication' id='realname-authentication'>未完成</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item' onClick={myDynamic}>
          <Text className='title'>我的动态</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item' onClick={commonProblems}>
          <Text className='title'>常见问题</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item' onClick={feedback}>
          <Text className='title'>意见反馈</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item' onClick={aboutUs}>
          <Text className='title'>关于我们</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item' onClick={logout}>
          <Text className='title'>退出</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
      </View>
    </View>
  );
};

export default User;