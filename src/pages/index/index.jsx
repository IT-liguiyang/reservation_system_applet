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
import {reqSchools, reqHotSchools} from './service';

import './index.less';
import swiper1 from '../../static/swiper/1.png';
import swiper2 from '../../static/swiper/2.png';
import swiper3 from '../../static/swiper/3.png';
import reservation_entry from '../../static/reservation-entry/reservation-entry.png';
import config from '../../api/config';  // 引入图片的公共路径

const Index = () => {

  const [ schoolList, setSchoolList ] = useState([]); // 所有学校的列表
  const [ nearFinalSchoolList, setFinalNearSchoolList ] = useState([]); // 附近学校的列表

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect( async () => {

    // 发送请求获取所有学校
    const result = await reqSchools(1, 6);
    console.log('1111', result.data.list);
    setSchoolList(result.data.list);

    // 获取附近学校
    getNearSchool();
  }, []);

  Taro.getApp().mtj.setUserInfo({
    tel: '18275166092',
  });

  const districtList = [
    '市直属','观山湖区','云岩区','南明区','乌当区','白云区','花溪区','贵安新区','清镇市','修文县','开阳县','开阳县','息烽县'
  ];
  
  // 各行政区接壤邻接矩阵
  const adjacent_matrix = [
    [1,1,1,1,1,1,1,1,1,1,1,1], // 市直属
    [1,1,1,0,0,1,1,0,1,1,0,0], // 观山湖区
    [1,1,1,1,1,1,1,0,0,0,0,0], // 云岩区
    [1,0,1,1,1,0,1,0,0,0,0,0], // 南明区
    [1,0,1,1,1,1,0,0,0,1,1,0], // 乌当区
    [1,1,1,0,1,1,0,0,1,1,0,0], // 白云区
    [1,1,1,1,0,0,1,1,1,0,0,0], // 花溪区
    [1,0,0,0,0,0,1,1,1,0,0,0], // 贵安新区
    [1,1,0,0,0,1,1,1,1,1,0,0], // 清镇市
    [1,1,0,0,1,1,0,0,1,1,1,1], // 修文县
    [1,0,0,0,1,0,0,0,0,1,1,1], // 开阳县
    [1,0,0,0,0,0,0,0,0,1,1,1], // 息烽县
  ];

  // 获取附近学校列表
  const getNearSchoolList = async (dis, longitude, latitude) => {
    let district_index = 0; // 记录当前区域的索引
    let district_index_list = []; // 记录当前区域的接壤区域矩阵
    let district_name_list = []; // 记录当前区域的接壤区域矩阵
    districtList.map((item, index) => {
      if(item === dis) {
        district_index = index; // 得到当前区域的索引
        district_index_list = adjacent_matrix[index]; // 根据当前区域的索引，得到它接壤区域的领接矩阵
      }
    });
    district_index_list.map((item, index) => {
      if(item === 1 && index !== district_index){
        district_name_list.push(districtList[index]); // 得到所有接壤区域的名称
      }
    });
    // 根据附近接壤区域名称查询附近的所有学校
    const result = await reqHotSchools(district_name_list);
    const distanceList = []; // 存放计算距离后的学校列表
    // 分别计算距离
    result.data.map((item) => {
      const distance = Math.sqrt(Math.pow(item.latitude*1-latitude, 2)+Math.pow(item.longitude*1-longitude, 2));
      distanceList.push({'distance': distance, 'schoolObj': item});
    });
    // 根据距离进行排序
    distanceList.sort(compare('distance'));
    setFinalNearSchoolList(distanceList);
  };

  // 获取所在 区域 名称
  const getLocationName = (lat, lon) => {
    return new Promise((resolve) => {
      let latlon = lat + ',' + lon;
      Taro.request({
        url: 'http://api.map.baidu.com/geocoder/v2/?ak=2TGbi6zzFm5rjYKqPPomh9GBwcgLW5sS&callback=renderReverse&location=' + latlon + '&output=json&pois=0',
        method: 'POST',
        success: (res) => {
          console.log('2010', JSON.parse(res.data.slice(29,-1))); 
          const result = JSON.parse(res.data.slice(29,-1));
          // 得到区域名称
          const district = result.result.addressComponent.district;
          resolve(district); // 返回
        },
        fail: (err) => {
          console.log('999', err); // reject修改promise的状态为失败状态 rejected
        }
      });
    });
    
  };

  // 获取附近学校
  const getNearSchool = async () => {
    let longitude = 0;
    let latitude = 0;
    // 1. 获取当前定位,得到经纬度
    Taro.getLocation({
      type: 'wgs84',
      success: function (res) {
        longitude = res.longitude;
        latitude = res.latitude;
        console.log('经纬度1', longitude, latitude);
        getLocationName(latitude, longitude).then((district) => {
          console.log('district',district);
          getNearSchoolList(district, longitude, latitude);
        }).catch((err) => {
          console.log(err);
        });
      }
    });
  };

  // 排序比较函数
  const compare = (property) => {
    return (a, b) => {
      return a[property] - b[property];
    };
  };
  // console.log('经纬度', longitude, latitude);

  console.log('nearFinalSchoolList', nearFinalSchoolList);

  // 构造轮播图图片
  const imageList = [ swiper1, swiper2, swiper3 ];

  const handleOnclickReservationEntry = () => {
    Taro.navigateTo({
      url:'../school-list/index'
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
      url:'../school-list/index'
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
      
      {/* 附近学校 */}
      {
        nearFinalSchoolList.length>0? (
          <View className='hot-school'>
            <View className='title'>附近学校</View>
            <ScrollView 
              className='container' 
              enableFlex='true'
              scrollHeight='0'
              scrollX
              scrollWithAnimation
              showScrollbar='false'  // 是否显示滚动条
            >
              {
                nearFinalSchoolList.slice(0,5).map((item) => {
                  return (
                    <View className='scrollItem' key={item.schoolObj._id} onClick={()=> jumpToSchoolIndex(item.schoolObj)}>
                      <Image className='scrollItem-image' src={config.basicImgUrl+item.schoolObj.image[0]}></Image>
                      <Text className='scrollItem-text'>{item.schoolObj.school[1]}</Text>
                    </View>
                  );
                })
              }
            </ScrollView>
          </View>
        ):''
      }

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
        <Text className='more' onClick={showMoreSchool}>更多</Text>
        {/* 学校列表 */}
        <SchoolItem schoolList={schoolList} />
      </View>

    </View>
  );
};

export default Index;