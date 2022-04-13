import Taro from '@tarojs/taro';
import { 
  View, 
  Image, 
  Text,
  Label
} from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.css';
import config from '../../api/config';

const SchoolItem = (props) => {

  console.log('SchoolItem', props);

  SchoolItem.propTypes = {
    schoolList: PropTypes.array.isRequired,
  };

  const jumpToSchoolIndex = (item) => {
    Taro.navigateTo({
      url: '../school/index',
      success: function(res){
        res.eventChannel.emit('acceptData', { data: item });
      }
    });
  };

  // 通过正则匹配，从String型的开放区域里找出每个label用于在小程序首页展示
  const getOpenAreas = (openAreasInfoStr) => {
    const openAreasList = [];
    const allOpenAerasList = ['篮球场','足球场','羽毛球场','乒乓球场','乒乓球台','网球场','田径场','排球场','运动场'];
    allOpenAerasList.map((item) => {
      if(openAreasInfoStr.match(RegExp(item))){
        openAreasList.push(item);
      }
    });
    console.log('openAreasList', openAreasList);
    return (
      openAreasList.splice(0,4).map((item, index) => {  // 使用 splice 控制最多可以展示4个
        return(
          <Label key={index} className='school-label'>{item}</Label>
        );
      })
    );
  };

  return(
    <View>
      {
        props.schoolList.map((item) => {
          return (
            <View key={item._id} className='container' onClick={()=> jumpToSchoolIndex(item)}>
              <Image className='container-image' src={config.basicImgUrl+item.image[0]}></Image>
              <View className='school'>
                <Text className='school-name'>{item.school[1].length > 11 ? item.school[1].slice(0,11)+'...' : item.school[1]}</Text>
                <Text className='school-address'>{item.address}</Text>
                {
                  getOpenAreas(item.openAreasInfoStr)
                }
              </View>
            </View>
          );
        })
      }
    </View>
  );
};

export default SchoolItem;