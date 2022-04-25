import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { AtTabs, AtTabsPane } from 'taro-ui';
import { Button, Swiper, SwiperItem, Image, View, Text } from '@tarojs/components';

import { reqAnnouncementByPublisher, reqBookingInfoBySchooId, reqReservationInfoBySchoolId } from './service';
import { BASE_IMG_URL } from '../../utils/constants';

import './index.less';

const School = () => {

  const [ userObj, setUserObj ] = useState({}); // 用于保存当前登录的用户对象
  const [ schoolObj, setSchoolObj ] = useState({}); // 用于保存学校对象
  const [ bookingInfo, setBookingInfo] = useState([]); // 存放学校的开放信息（不一定是完整的一个月）
  const [ acticeBar, setActiceBar ] = useState(0);  // 当前选择的tab
  const [ announcementList, setAnnouncementList ] = useState([]); // 学校公告列表
  const [ reservationInfoList, setReservationInfoList ] = useState([]); // 学校评价列表

  useEffect(() => {
    // 获取当前登录的用户对象
    setUserObj(Taro.getStorageSync('userObj'));

    // 得到点击页面传过来的一个学校对象 item
    const pages = Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.on('acceptData', async (data) => {
      console.log('接收到的学校对象', data.data);
      setSchoolObj(data.data);

      const result = await reqBookingInfoBySchooId(data.data._id); 
      setBookingInfo(result.data);
    });
  }, []);

  console.log('userObj', userObj);

  const { 
    _id,
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
    openBooking
  } = schoolObj || {};

  // 点击 tab 的回调
  const handleClick = async (value) =>{
    setActiceBar(value);

    // 请求公告 若已有数据就不再请求
    if(announcementList.length === 0 && value === 2) {
      const result = await reqAnnouncementByPublisher(school[1]);
      console.log('announcement', result);
      setAnnouncementList(result.data);
    }

    // 请求评价 若已有数据就不再请求
    if(reservationInfoList.length === 0 && value === 3) {
      const school_id = _id;
      const result = await reqReservationInfoBySchoolId(school_id);
      console.log('reservationInfoList', result);
      setReservationInfoList(result.data);
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

  // 跳转至预约界面
  const goReserve = () => {
    const { realname, ID_number, profession, head_portrait, realname_authentication } = userObj || {};
    if(!realname && !ID_number && !profession && head_portrait.length ===0) {
      Taro.showToast({
        title:'请完善个人信息',
        icon: 'error'
      });
      return;
    }
    if(realname_authentication === '未完成') {
      Taro.showToast({
        title:'请完成实名认证',
        icon: 'error'
      });
      return;
    }
    Taro.navigateTo({
      url: '../reservation/index',
      success: function(res){
        res.eventChannel.emit('school_id', { data: _id });
        res.eventChannel.emit('reservationNotice', { data: reservationNotice });
      }
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
            <AtTabsPane className='comment' current={acticeBar} index={3}>
              {
                reservationInfoList.length !== 0 ? (
                  reservationInfoList.map((item) => {
                    if(item.comment.length ===0) return;
                    return(
                      <View key={item._id} className='comment-item'>
                        <View className='comment-item-left'>
                          <Image className='avater' src={BASE_IMG_URL+item.res_avater[0]}></Image>
                        </View>
                        <View className='comment-item-right'>
                          {/* 姓名区域 */}
                          <Text className='realname'>{item.res_realname}</Text>
                          <Text className='place-info'>{item.res_date} {item.res_time} {item.res_place}</Text>
                          {/* 动态内容区域 */}
                          <View className='content'>{item.comment?item.comment[0].pub_content:''}</View>
                          {/* 图片列表区域 */}
                          <View className='image-list'>
                            {
                              item.comment?item.comment[0].image_list.map((img, index) => {
                                return(
                                  <Image key={index} className='image-list image' src={BASE_IMG_URL+img}></Image>
                                );
                              }):''
                            }
                          </View>
                          {/* 时间区域 */}
                          <View className='time-area'>
                            {/* 左侧时间显示 */}
                            <View className='time'>{item.submit_time}</View>
                          </View>
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
        <Button 
          className={bookingInfo.length !==0 && openBooking!=='0' ? 'button':'disable-button'} 
          disabled={bookingInfo.length !==0 && openBooking!=='0' ? false:true} 
          onClick={goReserve}
        >{openBooking!=='0' ? (bookingInfo.length ===0 ?'暂无开放信息':'立即预约'):'闭馆'}</Button>
      </View>
    </View>
  );
};

export default School;