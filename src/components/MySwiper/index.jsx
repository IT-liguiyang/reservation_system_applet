import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.css';

const MySwiper = (props) => {

  MySwiper.propTypes = {
    imageList: PropTypes.array.isRequired,
  };

  return(
    <View>
      <Swiper
        className='index-swiper'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        // indicatorDots='false'
        vertical='false'
        autoplay='false'
        interval='2000'
        duration='500'
      >
        {
          props.imageList.map((item) => {
            return (
              <SwiperItem key={item.key}>
                <View key={item.key} className='index-swiper-view'>
                  <Image key={item.key} className='index-swiper-image' src={item.path}></Image>
                </View>
              </SwiperItem>
            );
          })
        }
      </Swiper>
    </View>
  );
};

export default MySwiper;