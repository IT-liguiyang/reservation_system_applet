import { useState} from 'react';
import { View, Image, Text } from '@tarojs/components';
import './index.less';

const User = ()=>{

  const [ avater ] = useState('');
  return(
    <View className='personal'>
      <View className='personal-top'>
        {
          avater ? 
            (<Image className='personal-top-image' src='../../static/swiper/1.png'></Image>)
            :(<Text className='iconfont icon-morentouxiang'></Text>)
        }
        <Text className='personal-top-text'>18275166098</Text>
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
        <Text className='personal-bottom-item'>
          <Text className='title'>个人信息</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item'>
          <Text className='title'>实名认证</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item'>
          <Text className='title'>我的动态</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item'>
          <Text className='title'>常见问题</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item'>
          <Text className='title'>意见反馈</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item'>
          <Text className='title'>账号管理</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
        <Text className='personal-bottom-item'>
          <Text className='title'>关于我们</Text>
          <Text className='iconfont icon-youjiantou'></Text>
        </Text>
      </View>
    </View>
  );
};

export default User;