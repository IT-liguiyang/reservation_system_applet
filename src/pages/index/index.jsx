import Taro from '@tarojs/taro';
import { View, Text, Input, Icon } from '@tarojs/components';

import './index.less';

const Index = () => {

  Taro.onPullDownRefresh = () => {};//下拉事件
  Taro.stopPullDownRefresh();//停止下拉动作过渡
 
  Taro.onReachBottom = () => {};//上拉事件监听

  return(
    <View className='index'>
      <View className='index-head'>
        <Text className='index-head-text'>筑城文体通</Text>
        <View className='index-head-serach'>
          <Icon className='index-head-icon' size='12' type='search' />
          <Input className='index-head-input' placeholder='搜索' addonBefore='111111'></Input>
        </View>
      </View>
    </View>
  );
};

export default Index;