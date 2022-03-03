import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { 
  View, 
  Text, 
  Input, 
  Icon, 
  // Button,
  Image
} from '@tarojs/components';

import MySwiper from '../../components/MySwiper';
import SchoolItem from '../../components/SchoolItem';
import reqSchools from './service';

import './index.less';
import swiper1 from '../../static/swiper/1.png';
import swiper2 from '../../static/swiper/2.png';
import swiper3 from '../../static/swiper/3.png';
import reservation_entry from '../../static/reservation-entry/reservation-entry.png';

const Index = () => {

  const [ schoolList, setSchoolList ] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect( async () => {
    // 发送请求
    const result = await reqSchools('1', '6');
    console.log('1111', result.data.list);

    setSchoolList(result.data.list);
  }, []);

  // 构造轮播图图片
  const imageList = [
    {key: 0, path: swiper1},
    {key: 1, path: swiper2},
    {key: 2, path: swiper3},
  ];

  const handleOnclickReservationEntry = () => {
    Taro.navigateTo({
      url:'../reservation/index'
    });
  };

  const handleSearch = () => {
    Taro.navigateTo({
      url:'../search/index'
    });
  };

  Taro.onPullDownRefresh = () => {};//下拉事件
  Taro.stopPullDownRefresh();//停止下拉动作过渡
 
  Taro.onReachBottom = () => {};//上拉事件监听

  return(
    <View className='index'>
      <View className='index-head'>
        <Text className='index-head-text'>筑城文体通</Text>
        <View className='index-head-serach'>
          <Icon className='index-head-icon' size='12' type='search' />
          <Input className='index-head-input' onClick={handleSearch} placeholder='搜索'></Input>
        </View>
      </View>
      {/* 轮播图 */}
      <MySwiper imageList={imageList} />
      <Image className='reservation-image' onClick={handleOnclickReservationEntry} src={reservation_entry}></Image>
      <View className='index-hot'>
        <Text className='index-hot-title'>热门学校</Text>
        {/* 学校列表 */}
        <SchoolItem schoolList={schoolList} />
      </View>

    </View>
  );
};

export default Index;