import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Button, View, Text, Input, Image } from '@tarojs/components';
import { AtTabs, AtTabsPane, AtFloatLayout } from 'taro-ui';

import { 
  reqPersonalReservationInfo, 
  reqUpdateStatus, 
  reqBookingInfoBySchoolId, 
  reqUpdateOpenInfoInfoBySchoolId,
  reqSchoolInfoById
} from './service';

import { BASE_IMG_URL } from '../../../utils/constants';
import './index.less';

const Reservation = () => {
  
  const [ acticeBar, setActiceBar ] = useState(0);  // 当前选择的tab
  const [ usingArrayList, setUsingArrayList ] = useState([]);  // 当前选择的tab
  const [ canceledArrayList, setCanceledArrayList ] = useState([]);  // 当前选择的tab
  const [ finishedArrayList, setFinishedArrayList ] = useState([]);  // 当前选择的tab
  const [ unuseArrayList, setUnuseArrayList ] = useState([]);  // 当前选择的tab
  const [ isShowDetail, setIsShowDetail] = useState(false); // 控制是否显示详情
  const [ currentShowItem, setCurrentShowItem ] = useState({}); // 当前显示的那一条预约信息
  const [ isShowComment, setIsShowComment] = useState(false); // 控制是否显示详情
  const [ currentShowComment, setCurrentShowComment ] = useState({}); // 当前显示的那一条预约信息

  const userObj_from_storage = Taro.getStorageSync('userObj');
  const { username } = userObj_from_storage || {};

  useEffect(() => {
    // 得到点击页面传过来的一个学校对象 item
    const pages = Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.on('activeBar', async (data) => {
      console.log('接收a到的ctiveBar', data.data);
      if(data.data) setActiceBar(data.data);
    });
    getPersonalReservationInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabList = [{ title: '待使用' }, { title: '已完成' }, { title: '已取消' }, { title: '未使用' }];

  const getPersonalReservationInfo = async () => {
    const temp_usingArrayList = []; // 待使用的预约记录
    const temp_canceledArrayList = []; // 已取消的预约记录
    const temp_finishedArrayList = []; // 已完成的预约记录
    const temp_unuseArrayList = []; // 未使用的预约记录（逾期）
    const result = await reqPersonalReservationInfo(username);
    if(result.status === 0) {
      result.data.map((item) => {
        if(item.status === 'using'){
          temp_usingArrayList.push(item);
        } else if (item.status === 'canceled'){
          temp_canceledArrayList.push(item);
        } else if (item.status === 'finished'){
          temp_finishedArrayList.push(item);
        } else if (item.status === 'unuse'){
          temp_unuseArrayList.push(item);
        }
      });
    }
    setUsingArrayList(temp_usingArrayList);
    setCanceledArrayList(temp_canceledArrayList);
    setFinishedArrayList(temp_finishedArrayList);
    setUnuseArrayList(temp_unuseArrayList);

  };

  // 点击 tab 的回调
  const handleClick = async (value) =>{
    setActiceBar(value);
  };

  // 查看预约详情
  const showDetail = (item) => {
    setIsShowDetail(true);
    setCurrentShowItem(item);
  };

  // 取消预约
  const cancelReservation = (reservationItem) => {
    Taro.showModal({
      title: '提示',
      content: '确定取消预约嘛？',
      success:  async (res) =>{
        if (res.confirm) {
          console.log('用户点击确定');
          console.log('reservationItem', reservationItem);
          const { _id, res_school_id, res_date, res_place, res_time } = reservationItem || {};
      
          // 1.将取消的场馆 已预约数量 减1
          // 得到原本的 open_info，修改已预定数量后，在根据 school_id 更新
          const school_id = res_school_id;
          const booking_info = await reqBookingInfoBySchoolId(school_id); 
          console.log('booking_info', booking_info);
          const { open_info } = booking_info.data[0] || {}; 
          console.log('open_info', open_info);
          
          // 先更新 open_infp
          open_info.map((item) => {
            item.map((item1) => {
              if(item1.day === res_date && item1.placeName === res_place) {
                item1.timeIntervals.map((item2) => {
                  item2.map((item3) => {
                    if(item3.beginTime === res_time.split('-')[0] && item3.endTime === res_time.split('-')[1]){
                      item3.bookedCount = (item3.bookedCount*1-1).toString();
                    }
                  });
                });
              }
            });
          });
          const newOpenInfo = open_info;
          // 发送请求更新 open_info
          const updatedBookingInfo = await reqUpdateOpenInfoInfoBySchoolId({newOpenInfo, school_id}); 
          console.log('updatedBookingInfo', updatedBookingInfo);
      
          // 1. 将 using 状态转为 canceled 状态
          const reservation_infoId = _id;
          const  status = 'canceled';
          const result = await reqUpdateStatus({status, reservation_infoId});
          console.log(result);
      
          if(result.status === 0) {
            Taro.showToast({
              title:'取消成功',
              icon: 'success',
              duration: 1000
            });
            // 重新获取数据，加载页面
            getPersonalReservationInfo();
          }
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });

  };

  // 关闭预约详情的回调
  const handleCloseShowDetail = () => {
    setIsShowDetail(false);
  };

  // 点击再次预约，跳转至学校的首页
  const reBooking = async (reservationItem) => {
    console.log('reservationItem', reservationItem);
    const { res_school_id } = reservationItem || {};
    const school_id = res_school_id;
    // 通过学校 -id 查询学校信息
    const result = await reqSchoolInfoById(school_id);
    console.log(result);
    Taro.navigateTo({
      url: '../../school/index',
      success: function(res){
        res.eventChannel.emit('acceptData', { data: result.data[0] });
      }
    });
  };

  // 点击发布评价的回调
  const giveComment = (item) => {

    // 评价数组不为空，说明已经评价，则是 “查看评价”， 否则为 “发布评价”
    if(item.comment.length>0){
      console.log('查看评论');
      setIsShowComment(true);
      setCurrentShowComment(item);
      return;
    }
    Taro.navigateTo({
      url:'./comment/index',
      success: function(res){
        res.eventChannel.emit('acceptData', { data: item });
      }
    });
  };

  // 关闭预约详情的回调
  const handleCloseShowComment = () => {
    setIsShowComment(false);
  };

  console.log('currentShowComment', currentShowComment);

  return(
    <View className='reservation'>
      <AtFloatLayout className='showDetail' isOpened={isShowDetail} onClose={handleCloseShowDetail} title='预约详情'>
        <View className='form-item'>
          <Text className='title'>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;校:</Text>
          <Input name='res_school' className='input' value={currentShowItem.res_school_name} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期:</Text>
          <Input name='res_date' className='input' value={currentShowItem.res_date} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>场&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;馆:</Text>
          <Input name='res_place' className='input' value={currentShowItem.res_place} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</Text>
          <Input name='res_time' className='input' value={currentShowItem.res_time} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>预&nbsp;&nbsp;约&nbsp;&nbsp;人:</Text>
          <Input name='res_realname' className='input' value={currentShowItem.res_realname} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>手&nbsp;&nbsp;机&nbsp;&nbsp;号:</Text>
          <Input name='res_username' className='input' value={currentShowItem.res_username} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>交通方式:</Text>
          <Input name='res_username' className='input' value={currentShowItem.vehicle} disabled></Input>
        </View>
      </AtFloatLayout>
      <AtFloatLayout className='showComment' isOpened={isShowComment} onClose={handleCloseShowComment} title='评价详情'>
        <View className='head'>
          <View className='iconfont icon-xuexiao_xuexiaoxinxi'></View>
          <View className='school-name'>{currentShowComment.res_school_name}</View>
        </View>
        <View className='booking-info'>
          <View className='time'>
            <View className='title'>预约的时间：</View>
            <View className='text'>{currentShowComment.res_date} {currentShowComment.res_time}</View>
          </View>
          <View className='place'>
            <View className='title'>预约的场馆：</View>
            <View className='text'>{currentShowComment.res_place}</View>
          </View>
          <View className='vehicle'>
            <View className='title'>来往交通方式：</View>
            <View className='text'>{currentShowComment.vehicle}</View>
          </View>
        </View>
        <View className='comment'>
          <View className='content'>
            <View className='title'>评价的内容：</View>
            <View className='text'>{currentShowComment.comment?currentShowComment.comment[0].pub_content:''}</View>
          </View>
          <View className='image'>
            <View className='title'>评价的图片：</View>
            <View className='image-list'>
              {
                currentShowComment.comment?currentShowComment.comment[0].image_list.map((img, index) => {
                  return(
                    <Image key={index} className='image-list image' src={BASE_IMG_URL+img}></Image>
                  );
                }):''
              }
            </View>
          </View>
          <View className='service'>
            <View className='title'>服务态度评分：</View>
            <View className='text'>{currentShowComment.comment?currentShowComment.comment[0].serviceAttitudeRate+'分':''}</View>
          </View>
          <View className='facility'>
            <View className='title'>设施环境评分：</View>
            <View className='text'>{currentShowComment.comment?currentShowComment.comment[0].environmentalFacilityRate+'分':''}</View>
          </View>
        </View>
      </AtFloatLayout>
      <AtTabs current={acticeBar} tabList={tabList} onClick={handleClick}>
        <AtTabsPane className='using-container' current={acticeBar} index={0} >
          {
            usingArrayList.length>0? usingArrayList.map((item, index) => {
              return(
                <View key={index} className='using-item'>
                  <View className='head'>
                    <View className='iconfont icon-xuexiao_xuexiaoxinxi'></View>
                    <View className='school-name'>{item.res_school_name.length>14?item.res_school_name.slice(0,15)+'...':item.res_school_name}</View>
                    <View className='using-status'>待使用</View>
                  </View>
                  <View className='booking-info'>
                    <View className='time'>
                      <View className='title'>预约的时间：</View>
                      <View className='text'>{item.res_date} {item.res_time}</View>
                    </View>
                    <View className='place'>
                      <View className='title'>预约的场馆：</View>
                      <View className='text'>{item.res_place}</View>
                    </View>
                    <View className='vehicle'>
                      <View className='title'>来往交通方式：</View>
                      <View className='text'>{item.vehicle}</View>
                    </View>
                  </View>
                  <View className='operation'>
                    <Button className='detail' onClick={()=>{showDetail(item);}}>查看详情</Button>
                    <Button className='cancel' onClick={()=>{cancelReservation(item);}}>取消预约</Button>
                  </View>
                </View>
              );
            }):(
              <View className='noDate'>
                <View className='iconfont icon-wushuju'></View>
                <View className='noDate-text'>暂无数据</View>
              </View>
            )
          }
        </AtTabsPane>
        <AtTabsPane className='finished-container' current={acticeBar} index={1} >
          {
            finishedArrayList.length>0? finishedArrayList.map((item, index) => {
              return(
                <View key={index} className='finished-item'>
                  <View className='head'>
                    <View className='iconfont icon-xuexiao_xuexiaoxinxi'></View>
                    <View className='school-name'>{item.res_school_name.length>14?item.res_school_name.slice(0,15)+'...':item.res_school_name}</View>
                    <View className='finished-status'>已完成</View>
                  </View>
                  <View className='booking-info'>
                    <View className='time'>
                      <View className='title'>预约的时间：</View>
                      <View className='text'>{item.res_date} {item.res_time}</View>
                    </View>
                    <View className='place'>
                      <View className='title'>预约的场馆：</View>
                      <View className='text'>{item.res_place}</View>
                    </View>
                    <View className='vehicle'>
                      <View className='title'>来往交通方式：</View>
                      <View className='text'>{item.vehicle}</View>
                    </View>
                  </View>
                  <View className='operation'>
                    <Button className='rebooking' onClick={()=>reBooking(item)}>再次预约</Button>
                    <Button className='comment'  onClick={()=>giveComment(item)}>{item.comment.length>0?'查看评价':'发布评价'}</Button>
                  </View>
                </View>
              );
            }):(
              <View className='noDate'>
                <View className='iconfont icon-wushuju'></View>
                <View className='noDate-text'>暂无数据</View>
              </View>
            )
          }
        </AtTabsPane>
        <AtTabsPane className='canceled-container' current={acticeBar} index={2} >
          {
            canceledArrayList.length>0? canceledArrayList.map((item, index) => {
              return(
                <View key={index} className='canceled-item'>
                  <View className='head'>
                    <View className='iconfont icon-xuexiao_xuexiaoxinxi'></View>
                    <View className='school-name'>{item.res_school_name.length>14?item.res_school_name.slice(0,15)+'...':item.res_school_name}</View>
                    <View className='canceled-status'>已取消</View>
                  </View>
                  <View className='booking-info'>
                    <View className='time'>
                      <View className='title'>预约的时间：</View>
                      <View className='text'>{item.res_date} {item.res_time}</View>
                    </View>
                    <View className='place'>
                      <View className='title'>预约的场馆：</View>
                      <View className='text'>{item.res_place}</View>
                    </View>
                    <View className='vehicle'>
                      <View className='title'>来往交通方式：</View>
                      <View className='text'>{item.vehicle}</View>
                    </View>
                  </View>
                </View>
              );
            }):(
              <View className='noDate'>
                <View className='iconfont icon-wushuju'></View>
                <View className='noDate-text'>暂无数据</View>
              </View>
            )
          }
        </AtTabsPane>
        <AtTabsPane className='unuse-container' current={acticeBar} index={3} >
          <View className='warning'>* 提示：若您在某个学校的逾期未使用次数累计超过3次，您会被学校列入黑名单，届时将影响您的预约！</View>
          {
            unuseArrayList.length>0? unuseArrayList.map((item, index) => {
              return(
                <View key={index} className='unuse-item'>
                  <View className='head'>
                    <View className='iconfont icon-xuexiao_xuexiaoxinxi'></View>
                    <View className='school-name'>{item.res_school_name.length>12?item.res_school_name.slice(0,12)+'...':item.res_school_name}</View>
                    <View className='unuse-status'>逾期未使用</View>
                  </View>
                  <View className='booking-info'>
                    <View className='time'>
                      <View className='title'>预约的时间：</View>
                      <View className='text'>{item.res_date} {item.res_time}</View>
                    </View>
                    <View className='place'>
                      <View className='title'>预约的场馆：</View>
                      <View className='text'>{item.res_place}</View>
                    </View>
                    <View className='vehicle'>
                      <View className='title'>来往交通方式：</View>
                      <View className='text'>{item.vehicle}</View>
                    </View>
                  </View>
                </View>
              );
            }):(
              <View className='noDate'>
                <View className='iconfont icon-wushuju'></View>
                <View className='noDate-text'>暂无数据</View>
              </View>
            )
          }
        </AtTabsPane>
      </AtTabs>
    </View>
  );
};

export default Reservation;