import { View, Image, Text } from '@tarojs/components';
import logo from '../../../static/login/li-without-border.png';

import './index.less';

const AboutUs = () => {
  return(
    <View className='about-us'>
      <View className='logo-edition'>
        <Image className='logo' src={logo}></Image>
        <View className='edition'>版本号 0.0.1</View>
        <Text className='bottom-text'>IT-GUIYANG. All right reserved.</Text>
      </View>
    </View>
  );
};

export default AboutUs;