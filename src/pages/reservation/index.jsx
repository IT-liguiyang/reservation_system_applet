import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import { AtFloatLayout } from 'taro-ui';
import moment from 'moment';
import { reqBookingInfoBySchooId } from './service';
import './index.less';

const Reservation = () => {

  const [ reservationNotice, setReservationNotice] = useState('');
  const [ isShowReservationNotice, setIsShowReservationNotice] = useState(true);
  const [ bookingInfo, setBookingInfo] = useState([]); // 存放学校的开放信息（不一定是完整的一个月）
  const [ currentMonthDays, setCurrentMonthDays ] = useState([]); // 存放当前月的日期数组
  const [ finalOpenInfo, setFinalOpenInfo ] = useState([]); // 存放最终的开放信息（完整的一个月）
  const [ isChooseDate, setIsChooseDate ] = useState(''); // 是否选择某个日期
  const [ isChoosePlace, setIsChoosePlace ] = useState(''); // 是否选择某个场馆
  const [ isChooseTime, setIsChooseTime ] = useState(''); // 是否选择某个时间段
  const [ startIndex, setStartIndex ] = useState(0); // 存放当前日期滑块的起始索引
  const [ oneDayOpenInfo, setOneDayOpenInfo ] = useState([]); // 选择某个日期对应那一天的开放信息
  const [ onePlaceOpenInfo, setOnePlaceOpenInfo ] = useState([]); // 选择某个日期对应那一天的开放信息
  const [ chooseDateInfo, setChooseDateInfo ] = useState(''); // 是否选择某个日期
  const [ choosePlaceInfo, setChoosePlaceInfo ] = useState(''); // 是否选择某个场馆
  const [ chooseTimeInfo, setChooseTimeInfo ] = useState(''); // 是否选择某个时间段

  useEffect(() => {
    // 得到点击页面传过来的一个学校对象 item
    const pages = Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.on('school_id', async (data) => {
      console.log('接收到的学校id', data.data);
      const result = await reqBookingInfoBySchooId(data.data); 
      setBookingInfo(result.data);
    });
    eventChannel.on('reservationNotice', async (data) => {
      console.log('接收到的学校reservationNotice', data.data);
      setReservationNotice(data.data);
    });

    // 得到当前月的日期数组
    getCurrentMonthDays();

    // 得到新的开放信息
    formNewOpenInfo();

  }, [bookingInfo]);

  // 得到当前月的日期数组
  const getCurrentMonthDays = () => {
    const dataTimes = [];
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const d = new Date(year, month, 0);
    const n = +d.getDate();
  
    for (var i = 1; i < n + 1; i++) {
      dataTimes.push(year + '-' + (month>=10? month: '0' + month) + '-' + (i>=10? i: '0' + i));
    }
    setCurrentMonthDays(dataTimes);
  };

  // 根据日期获取星期
  const getWeek = (day)=> {
    var weekArray = new Array('日', '一', '二', '三', '四', '五', '六');
    var week = weekArray[new Date(day).getDay()];//注意此处必须是先new一个Date
    return '星期' + week;
  };

  // 构造小程序展示的开放信息
  const formNewOpenInfo = () => {
    // 若原始的开放信息没有值则返回
    if(bookingInfo.length <= 0 ) return;
    const tempOpenInfo = [];

    currentMonthDays.map((oneDay) => {
      bookingInfo[0].open_info.map((item) => {
        // 若当前日期属于开放日期，则需下一步判断
        if(oneDay === item[0].day){
          // 若新的开放日期数组已经存在该日期但 open_info 为空, 则将原本的删除并重新添加有值的 open_info 
          if( isInvolve(tempOpenInfo, oneDay) === true) tempOpenInfo.pop({'date':oneDay, 'open_info': ''});
          tempOpenInfo.push({
            'date':oneDay, 'week': getWeek(oneDay), 'open_info': item
          });
        } else { 
          // 若当前日期不属于开放日期，判断当前日期是否在新的开放日期数组，
          // 若存在则直接 return，若不存在则添加 open_info 为空的对象进去
          if( isInvolve(tempOpenInfo, oneDay) === true) return;
          tempOpenInfo.push({
            'date':oneDay, 'week': getWeek(oneDay), 'open_info': ''
          });
        }
      });
    });
    setFinalOpenInfo(tempOpenInfo);

    // 获取日期选择滑块的起始索引
    const today = moment().format('YYYY-MM-DD');
    for(let i=0; i<tempOpenInfo.length; i++){
      if(tempOpenInfo[i].date === today){
        setStartIndex(i);
        return;
      }
    }
  };

  // 判断新的开放日期数组是否已经存在某个日期
  const isInvolve = (tempOpenInfo, oneDay) => {
    for(let i=0; i< tempOpenInfo.length; i++) {
      if(tempOpenInfo[i].date === oneDay) {
        return true;
      }
    }
  };

  console.log('bookingInfo', bookingInfo);
  console.log('finalOpenInfo', finalOpenInfo);

  // 选择日期的回调
  const chooseDate = (item) => {
    console.log('chooseDate', item);
    setIsChooseDate(item.date);
    setChooseDateInfo(item.date);
    setOneDayOpenInfo(item.open_info);
  };

  // 选择场馆的回调
  const choosePlace = (item) => {
    console.log('choosePlace', item);
    setIsChoosePlace(item.placeName);
    setChoosePlaceInfo(item.placeName);
    setOnePlaceOpenInfo(item.timeIntervals);
  };

  // 选择时间段的回调
  const chooseTime = (item) => {
    console.log('chooseTime', item);
    setIsChooseTime(item.beginTime);
    setChooseTimeInfo(item.beginTime+'-'+item.endTime);
  };

  console.log('oneDayOpenInfo', oneDayOpenInfo);

  // 关闭预定须知的回调
  const handleClose = () => {
    console.log('handleClose');
    setIsShowReservationNotice(false);
  };

  // 跳转至预约界面
  const goReserve = () => {
    console.log(chooseDateInfo);
    console.log(choosePlaceInfo);
    console.log(chooseTimeInfo);

    const tempReservationObj = {
      'res_school_id': bookingInfo.length>0? bookingInfo[0].school_id:'',
      'res_school': bookingInfo.length>0? bookingInfo[0].school[1]:'',
      'res_date': chooseDateInfo,
      'res_place': choosePlaceInfo,
      'res_time': chooseTimeInfo
    };
    Taro.navigateTo({
      url: '../reservation/reservation-form/index',
      success: function(res){
        res.eventChannel.emit('tempReservationObj', { data: tempReservationObj });
      }
    });
  };

  return(
    <View className='reservation'>
      <AtFloatLayout isOpened={isShowReservationNotice} onClose={handleClose} title='预约须知'>
        <View dangerouslySetInnerHTML={{__html: reservationNotice}}></View>
        <View className='next-btn'>
          <Button className='button' onClick={handleClose}>下一步</Button>
        </View>
      </AtFloatLayout>
      <View className='schoolName'>
        <Text className='title'>学校名称</Text>
        <View className='container'>{bookingInfo.length>0? bookingInfo[0].school[1]:''}</View>
      </View>
      <View className='choose-date'>
        <Text className='title'>选择日期</Text>
        <ScrollView 
          className='container' 
          enableFlex='true'
          scrollHeight='0'
          scrollX
          scrollWithAnimation
          showScrollbar='false'  // 是否显示滚动条
        >
          {
            finalOpenInfo.length>0? (
              finalOpenInfo.slice(startIndex, startIndex+7).map((item, index) => {
                return(
                  <View key={index} className={isChooseDate===item.date?'scrollItem active':'scrollItem'} onClick={()=> chooseDate(item)}>
                    <View className='date'>{item.date.slice(5,10)}</View>
                    <View className='week'>{item.week.slice(2,3)}</View>
                    <View className='isOpen'>{item.open_info !== ''? '可预约':'闭馆'}</View>
                    <View className='iconfont icon-jiaobiaoxuanzhong' style={{display:isChooseDate===item.date?'block':'none'}}></View>
                  </View>
                );
              })
            ):''
          }
        </ScrollView>
      </View>
      <View className='choose-place'>
        <Text className='title'>选择场馆</Text>
        <ScrollView 
          className='place-container' 
          enableFlex='true'
          scrollHeight='0'
          scrollX
          scrollWithAnimation
          showScrollbar='false'  // 是否显示滚动条
        >
          {
            oneDayOpenInfo.length>0? (
              oneDayOpenInfo.map((item, index) => {
                return(
                  <View key={index} className={isChoosePlace===item.placeName?'place-scrollItem active':'place-scrollItem'} onClick={()=> choosePlace(item)}>
                    <View className='placeName'>{item.placeName}</View>
                    <View className='iconfont icon-jiaobiaoxuanzhong' style={{display:isChoosePlace===item.placeName?'block':'none'}}></View>
                  </View>
                );
              })
            ):''
          }
        </ScrollView>
      </View>
      <View className='choose-time'>
        <Text className='title'>选择时段</Text>
        <View className='time-container'>
          {
            (oneDayOpenInfo.length>0 && onePlaceOpenInfo.length>0)? (
              onePlaceOpenInfo[0].map((item, index) => {
                return(
                  <View 
                    key={index} 
                    style={{display:item.beginTime === ''? 'none':''}}
                    className={isChooseTime===item.beginTime?'time-scrollItem active':'time-scrollItem'} 
                    onClick={()=> chooseTime(item)}
                  >
                    <View className='time'>{item.beginTime}-{item.endTime}</View>
                    <View className='text'>免费</View>
                    <View className='count'>余{item.maxBookingCount-item.bookedCount}</View>
                    <View className='iconfont icon-jiaobiaoxuanzhong' style={{display:isChooseTime===item.beginTime?'block':'none'}}></View>
                  </View>
                );
              })
            ):''
          }
        </View>
      </View>
      <View className='reservation-btn'>
        <Button 
          className={isChooseDate !== '' && isChoosePlace !== '' && isChooseTime !== ''? 'button':'disable-button'}
          disabled={isChooseDate !== '' && isChoosePlace !== '' && isChooseTime !== ''? false:true} 
          onClick={goReserve}
        >立即预约</Button>
      </View>
    </View>
  );
};

export default Reservation;