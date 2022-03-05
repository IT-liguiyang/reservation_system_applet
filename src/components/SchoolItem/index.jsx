import { 
  View, 
  Image, 
  Text,
  Label
} from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.css';

const SchoolItem = (props) => {

  console.log(props);

  SchoolItem.propTypes = {
    schoolList: PropTypes.array.isRequired,
  };

  const handleOnClick = (e) => {
    console.log(222, e);
  };

  const basicImgUrl = 'http://localhost:5000/upload/';   // 图片上传的 baseUrl

  return(
    <View>
      {
        props.schoolList.map((item) => {
          return (
            <View key={item._id} className='container' onClick={handleOnClick}>
              <Image className='container-image' src={basicImgUrl+item.image[0]}></Image>
              <View className='school'>
                <Text className='school-name'>{item.school[1]}</Text>
                <Text className='school-address'>{item.address}</Text>
                {
                  item.open_areas.splice(0,4).map((childItem, index) => {  // 使用 splice 控制最多可以展示4个
                    return(
                      <Label key={index} className='school-label'>{childItem.open_area}</Label>
                    );
                  })
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