import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { 
  View, 
  Text, 
  Input, 
  Icon, 
  // Button,
  Image,
  ScrollView
} from '@tarojs/components';

import MySwiper from '../../components/MySwiper';
import SchoolItem from '../../components/SchoolItem';
import reqSchools from './service';

import './index.less';
import swiper1 from '../../static/swiper/1.png';
import swiper2 from '../../static/swiper/2.png';
import swiper3 from '../../static/swiper/3.png';
import reservation_entry from '../../static/reservation-entry/reservation-entry.png';
import config from '../../api/config';  // 引入图片的公共路径

const Index = () => {

  const [ schoolList, setSchoolList ] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect( async () => {
    // 发送请求
    const result = await reqSchools(1, 6);
    console.log('1111', result.data.list);

    setSchoolList(result.data.list);
  }, []);

  // 构造轮播图图片
  const imageList = [ swiper1, swiper2, swiper3 ];

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

  // 点击查看更多学校
  const showMoreSchool = () => {
    Taro.navigateTo({
      url:'../search/index'
    });
  };

  Taro.onPullDownRefresh = () => {};//下拉事件
  Taro.stopPullDownRefresh();//停止下拉动作过渡
 
  Taro.onReachBottom = () => {};//上拉事件监听

  console.log('666', schoolList);

  const jumpToSchoolIndex = (item) => {
    Taro.navigateTo({
      url: '../school/index',
      success: function(res){
        res.eventChannel.emit('acceptData', { data: item });
      }
    });
  };

  return(
    <View className='index'>
      {/* 搜索框 */}
      <View className='index-head'>
        <Text className='index-head-text'>筑城文体通</Text>
        <View className='index-head-serach'>
          <Icon className='index-head-icon' size='12' type='search' />
          <Input className='index-head-input' onClick={handleSearch} placeholder='搜索'></Input>
        </View>
      </View>

      {/* 轮播图 */}
      <MySwiper imageList={imageList} />

      {/* 预约入口 */}
      <Image className='reservation-image' onClick={handleOnclickReservationEntry} src={reservation_entry}></Image>
      
      {/* 热门学校 */}
      <View className='hot-school'>
        <View className='title'>热门学校</View>
        <ScrollView 
          className='container' 
          enableFlex='true'
          scrollHeight='0'
          scrollX
          scrollWithAnimation
          showScrollbar='false'  // 是否显示滚动条
        >
          {
            schoolList.map((item) => {
              return (
                <View className='scrollItem' key={item._id} onClick={()=> jumpToSchoolIndex(item)}>
                  <Image className='scrollItem-image' src={config.basicImgUrl+item.image[0]}></Image>
                  <Text className='scrollItem-text'>{item.school[1]}</Text>
                </View>
              );
            })
          }
        </ScrollView>
      </View>

      {/* 所有学校 */}
      <View className='school-list'>
        <Text className='title'>学校列表</Text>
        <Text className='more' onClick={showMoreSchool}>查看更多</Text>
        {/* 学校列表 */}
        <SchoolItem schoolList={schoolList} />
      </View>

    </View>
  );
};

export default Index;