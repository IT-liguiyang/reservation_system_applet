import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Form, Text, Input, Button, Picker } from '@tarojs/components';
import { AtModal } from 'taro-ui';
import moment from 'moment';
import { reqAddReservationInfo, reqBookingInfoBySchoolId, reqUpdateOpenInfoInfoBySchoolId, reqAddMessage } from './service';
import './index.less';

const ReservationForm = () => {

  const [ tempReservationObj, setTempReservationObj ] = useState({}); // 接收上一个页面传过来的部分预约所需信息
  const [ vehicle, setVehicle ] = useState(''); // 用于存放用户选择的交通方式
  const [ inBlacklist ] = useState(false); // 用户存放当前用户是否在当前学校的黑名单中
  const [ isOpenModel, setIsOpenModel ] = useState(false); // 用户存放当前用户是否在当前学校的黑名单中
  // const [ bookingInfo, setBookingInfo] = useState([]); // 存放学校的开放信息（用于更新）

  const userObj_from_storage = Taro.getStorageSync('userObj');
  const { username, head_portrait, realname, ID_number } = userObj_from_storage || {};

  useEffect(() => {
    // 得到点击页面传过来的一个学校对象 item
    const pages = Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.on('tempReservationObj', async (data) => {
      console.log('接收到的学校id', data.data);
      setTempReservationObj(data.data);
    });
  }, []);

  const { res_school_id, res_school, res_date, res_place, res_time } = tempReservationObj || {};

  // 点击提交的回调
  const formSubmit = async () => {

    console.log(vehicle);
    // 提示选择交通方式
    if(!vehicle){
      Taro.showToast({
        title: '请选择交通方式',
        icon: 'error',
        duration: 1000
      });
      return;
    }

    // 若当前用户在黑名单中则警告弹出
    if(inBlacklist){
      setIsOpenModel(true);
      return;
    }
    
    // 2.构造更新的对象
    const reservationInfoObj = {
      'res_realname': realname,
      'res_username': username,
      'ID_number': ID_number,
      'res_avater': head_portrait,
      'res_school_id': res_school_id,
      'res_school_name': res_school, 
      'res_date': res_date, 
      'res_place': res_place, 
      'res_time': res_time,
      'vehicle': vehicle,
      'status': 'using',
      'submit_time': moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    console.log(reservationInfoObj);

    // 3.发送请求 添加预约信息
    const result = await reqAddReservationInfo(reservationInfoObj);
    console.log(result);

    if(result.status === 0) {
      // 说明：添加成功还需先判断是否可以更新 open_info 中场馆的 已预定数量，更新成功说明才预定成功
   
      // 得到原本的 open_info，修改已预定数量后，在根据 school_id 更新
      const booking_info = await reqBookingInfoBySchoolId(res_school_id); 
      const { school_id, open_info } = booking_info.data[0] || {}; 

      // 得到修改已预定数量后的 open_info
      const newOpenInfo = getUpdateOpenInfo(open_info);

      // 更新 open_info
      const updatedBookingInfo = await reqUpdateOpenInfoInfoBySchoolId({newOpenInfo ,school_id}); 
      console.log('updatedBookingInfo', updatedBookingInfo);

      // 更新成功则预约成功
      if(updatedBookingInfo.status === 0) {
        Taro.showToast({
          title: '预约成功！',
          icon: 'success'
        });
      }

      // 向用户发送预约成功的消息（向用户信息中插入一条记录）
      const messageObj = {
        publisher: res_school,
        acceptor: username,
        pub_time: moment().format('YYYY-MM-DD HH:mm'),  // 发布时间,
        pub_content:'尊敬的'+ realname+ '先生/女士，您的预约申请我们已经收到，请您仔细阅读预定须知并按时到校锻炼，若未能到场请提前取消，否则逾期未使用将影响您的下次预约，感谢您的配合，谢谢！',
        isRead: false
      };
  
      console.log(messageObj);
  
      // 4. 提交添加的请求
      const addResult = await reqAddMessage(messageObj);
      console.log(addResult);

      if(addResult.status ===0) {
        setTimeout(() => {
          // 跳转到我的预约页面
          Taro.navigateTo({
            url: '../../user/my-reservation/index',
          });
          
        }, 1500);
      }
    } else if(result.status === 1){
      // 说明: 某个用户用户 某天的某个时段只能选择预约某一个学校的某个场馆，若选择其他的则会预约失败，并提示已预约
      // 服务器端如何判断？如果 res_username, res_date, (res_time) 同时存在一样的记录，说明今天的当前时段已经预约了场馆，不能再预约
      Taro.showToast({
        title: result.msg,
        icon: 'error',
        duration: 1000
      });
    }
  };

  // console.log('bookingInfo', bookingInfo);

  const getUpdateOpenInfo = (open_info) => {
    // 将预定的学校场地 已预订数量减1
    open_info.map((item) => {
      item.map((item1) => {
        if(item1.day === res_date && item1.placeName === res_place) {
          item1.timeIntervals.map((item2) => {
            item2.map((item3) => {
              if(item3.beginTime === res_time.split('-')[0] && item3.endTime === res_time.split('-')[1]){
                item3.bookedCount*1 < item3.maxBookingCount*1 ? item3.bookedCount = (item3.bookedCount*1+1).toString():(item3.maxBookingCount*1).toString();
              }
            });
          });
        }
      });
    });
    console.log('open_info', open_info);
    return open_info;
  };
  const selector = ['步行', '公交车', '地铁', '自驾', '自行车'];

  // 选择交通方式的回调
  const onVehicleChange = (e) => {
    setVehicle(selector[e.detail.value]);
  };

  // 关闭预约警告的回调
  const handleCloseModal = () => {
    setIsOpenModel(false);
  };

  return(
    <View className='reservation-form'>
      <Form className='form' onSubmit={formSubmit}>
        <View className='form-item'>
          <Text className='title'>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;校:</Text>
          <Input name='res_school' className='input' value={res_school} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期:</Text>
          <Input name='res_date' className='input' value={res_date} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>场&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;馆:</Text>
          <Input name='res_place' className='input' value={res_place} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</Text>
          <Input name='res_time' className='input' value={res_time} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>预&nbsp;&nbsp;约&nbsp;&nbsp;人:</Text>
          <Input name='res_realname' className='input' value={realname} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>手&nbsp;&nbsp;机&nbsp;&nbsp;号:</Text>
          <Input name='res_username' className='input' value={username} disabled></Input>
        </View>
        <View className='form-item'>
          <Text className='title'>交通方式:</Text>
          <Picker mode='selector' range={selector} onChange={onVehicleChange}>
            <View className='picker'>
              {vehicle?vehicle:'请选择来往的交通方式'}
            </View>
          </Picker>
        </View>
        
        <Button className='submit-btn' form-type='submit'>提&nbsp;&nbsp;交</Button>
      </Form>
      <AtModal
        className='warning-modal'
        isOpened={isOpenModel}
        title='警告'
        onClose={handleCloseModal}
        content='尊敬的用户您好，因为您多次预约学校场馆但并未到场使用，所以您被我校列入预约黑名单，三个月后会自动从黑名单移除，详情请来电咨询！'
      />
    </View>
  );
};

export default ReservationForm;