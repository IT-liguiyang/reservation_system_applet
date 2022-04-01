import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { AtTabs, AtTabsPane } from 'taro-ui';
import { Button, Swiper, SwiperItem, Image, View, Text } from '@tarojs/components';

import { reqAnnouncementByPublisher } from './service';
import { BASE_IMG_URL } from '../../utils/constants';

import './index.less';

const School = () => {

  const [schoolObj, setSchoolObj] = useState({}); // 用于保存学校对象
  const [acticeBar, setActiceBar] = useState(0);  // 当前选择的tab
  const [announcementList, setAnnouncementList] = useState([]); // 学校公告列表

  useEffect(() => {
    // 得到点击页面传过来的一个学校对象 item
    const pages = Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.on('acceptData', (data) => {
      console.log('接收到的学校对象', data.data);
      setSchoolObj(data.data);
    });
  }, []);

  const { 
    school, 
    image,
    telephone, 
    address, 
    longitude, 
    latitude,
    trafficGuidance,
    openTimeInfoStr,
    openAreasInfoStr,
    schoolIntroduce,
    reservationNotice,
    // openBooking
  } = schoolObj || {};

  // 点击 tab 的回调
  const handleClick = async (value) =>{
    setActiceBar(value);

    // 若已有数据就不再请求
    if(announcementList.length === 0 && value === 2) {
      const result = await reqAnnouncementByPublisher(school[1]);
      console.log('announcement', result);
      setAnnouncementList(result.data);
    }
  };

  // 点击返回的回调
  const back = () => {
    Taro.navigateBack();
  };

  // 线路规划
  const routePlan = () => {
    console.log(1111);
    // let plugin = Taro.requirePlugin('routePlan');
    let key = 'OHOBZ-PIYEX-DKB4P-7CYYE-WRWYT-KCFNO';  //使用在腾讯位置服务申请的key
    let referer = '筑城文体通';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': school? school[1]:'',
      'longitude': longitude,
      'latitude': latitude
    });
    Taro.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  };

  // 发起打电话
  const makePhoneCall = () => {
    Taro.makePhoneCall({
      phoneNumber: telephone //电话号码
    });
  };

  const tabList = [{ title: '场馆介绍' }, { title: '预定须知' }, { title: '学校公告' }, { title: '市民评论' }];

  return(
    <View className='school'>
      <View className='iconfont icon-zuojiantou' onClick={back}></View>
      <View className='swiper'>
        <Swiper
          className='index-swiper'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          vertical='false'
          autoplay='false'
          interval='2000'
          duration='500'
        >
          {
            image ? (
              image.map((item,index) => {
                return (
                  <SwiperItem className='index-swiper-item' key={index}>
                    <View className='index-swiper-view'>
                      <Image className='index-swiper-image' src={BASE_IMG_URL+item}></Image>
                    </View>
                  </SwiperItem>
                );
              })
            ):('')
          }
        </Swiper>
      </View>
      <View className='content'>
        <View className='school-basic-info'>
          <View className='top'>
            <View className='school-name'>{school? school[1]:''}</View>
            <View className='open-time'>
              <View className='iconfont icon-shijian'></View>
              <View className='text'>开放时间：{openTimeInfoStr}</View></View>
          </View>
          <View className='bottom'>
            <View className='bottom-left'>
              <View className='school-telephone'>电话：{telephone}</View>
              <View className='school-address'>地址：{address}</View>
            </View>
            <View className='bottom-right'>
              <View className='address' onClick={routePlan}>
                <View className='iconfont icon-weizhi'></View>
                <View className='address-text'>地址</View>
              </View>
              <View className='phone'>
                <View className='iconfont icon-dianhua' onClick={makePhoneCall}></View>
                <View className='phone-text'>电话</View>
              </View>
            </View>
          </View>
        </View>
        <View className='tabs'>
          <AtTabs current={acticeBar} tabList={tabList} onClick={handleClick}>
            <AtTabsPane  className='introduce' current={acticeBar} index={0}>
              <View className='tabs-item'>
                <Text className='tabs-item-title'>开放场地</Text>
                <View className='tabs-item-content'>{openAreasInfoStr}</View>
              </View>
              <View className='tabs-item'>
                <Text className='tabs-item-title'>开放时间</Text>
                <View className='tabs-item-content'>{openTimeInfoStr}</View>
              </View>
              <View className='tabs-item'>
                <Text className='tabs-item-title'>交通指引</Text>
                <View className='tabs-item-content'>{trafficGuidance || '暂无'}</View>
              </View>
              <View className='tabs-item'>
                <Text className='tabs-item-title'>学校简介</Text>
                <View className='tabs-item-content' dangerouslySetInnerHTML={{__html: schoolIntroduce}}></View>
              </View>
            </AtTabsPane>
            <AtTabsPane className='reservation_notice' current={acticeBar} index={1} >
              <View className='reservation_notice' style='background-color: #FAFBFC;' dangerouslySetInnerHTML={{__html: reservationNotice}}></View>
            </AtTabsPane>
            <AtTabsPane className='announcement' current={acticeBar} index={2}>
              {
                announcementList.length !== 0 ? (
                  announcementList.map((item, index) => {
                    return(
                      <View className='announcement-container' key={index}>
                        <View className='tabs-item-content' dangerouslySetInnerHTML={{__html: item.pub_content[0]}}></View>
                        <View className='announcement-bottom'>
                          <View>发布人：{item.publisher}</View>
                          <View>发布时间：{item.pub_time.slice(0,10)}</View>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View className='noDate'>
                    <View className='iconfont icon-wushuju'></View>
                    <View className='noDate-text'>暂无数据</View>
                  </View>
                )
              }
            </AtTabsPane>
            <AtTabsPane className='announcement' current={acticeBar} index={3}>
              {
                announcementList.length !== 0 ? (
                  announcementList.map((item, index) => {
                    return(
                      <View className='announcement-container' key={index}>
                        <View className='tabs-item-content' dangerouslySetInnerHTML={{__html: item.pub_content[0]}}></View>
                        <View className='announcement-bottom'>
                          <View>发布人：{item.publisher}</View>
                          <View>发布时间：{item.pub_time.slice(0,10)}</View>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View className='noDate'>
                    <View className='iconfont icon-wushuju'></View>
                    <View className='noDate-text'>暂无数据</View>
                  </View>
                )
              }
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>

      <View className='reservation-btn'>
        <Button className='button'>立即预约</Button>
      </View>
    </View>
  );
};

export default School;