import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Textarea, Button, Icon } from '@tarojs/components';
import { AtRate } from 'taro-ui';

import moment from 'moment';

import { reqUpdateComment } from './service';
import './index.less';

const CommentPublish = () => {

  const [ reservationInfoObj, setReservationInfoObj] = useState([]);  // 临时存放图片的数组
  const [ tempImageList, setTempImageList] = useState([]);  // 临时存放图片的数组
  const [ input_content, setInputContent] = useState(''); // 发布的内容
  const [ serviceAttitudeRateValue, setServiceAttitudeRateValue] = useState(3); // 保存服务态度评分值
  const [ environmentalFacilityRateValue, setEnvironmentalFacilityRateValue] = useState(3); // 保存环境设置评分值

  useEffect(() => {

    // 得到点击页面传过来的一个学校对象 item
    const pages = Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.on('acceptData', async (data) => {
      console.log('接收到的学校对象', data.data);
      setReservationInfoObj(data.data);
    });
  }, []);

  // 添加图片
  const addImage = () => {
    Taro.chooseImage({
      success (res) {
        const tempFilePaths = res.tempFilePaths;
        console.log('tempFilePaths', tempFilePaths);
        // 先将图片添加缓存imageList中，点击发布时在分别上传服务器
        setTempImageList([...tempImageList, ...tempFilePaths]);
      }
    });
  };

  // 发布动态
  const publish = async () => {
    // 接收 upLoadImage() 对象中返回的包含图片名称的 imageList，以便传入 postRequest中使用
    upLoadImage().then((finalImageList) => {
      postRequest(finalImageList);
    }).catch((err) => {
      console.log(err);
    });

  };

  const postRequest = async (finalImageList) => {

    // 1.准备数据
    console.log('finalImageList', finalImageList);
    const commentObj = {
      'pub_time': moment().format('YYYY-MM-DD HH:mm'),  // 发布时间
      'pub_content': input_content,  // 内容
      'image_list': finalImageList,  // 图片（数组） 
      'serviceAttitudeRate': serviceAttitudeRateValue,
      'environmentalFacilityRate': environmentalFacilityRateValue
    };

    console.log(commentObj);

    const { _id } = reservationInfoObj || {};
    const reservation_infoId = _id;

    // 2.发送请求
    const result = await reqUpdateComment({commentObj, reservation_infoId});
    console.log('postRequest-res', result);
    
    // 3. 提示发布成功并跳转
    if(result.status === 0) {
      Taro.showToast({
        title: '发布评价成功',
        icon: 'success',
        duration: 1500
      });
      setTimeout(() => {
        // 跳转至我的评价并使 activeBar 值为1
        Taro.navigateTo({
          url: '../index',
          success: function(res){
            res.eventChannel.emit('activeBar', { data: 1 });
          }
        });
        
      }, 1500);
    }
  };

  // 失去焦点直接先获取用户输入的动态内容
  const getContent = (e) => {
    setInputContent(e.detail.value);
  };

  // 上传图片至服务器, 点击发布时在调用
  const upLoadImage = () => {
    return new Promise((resolve) => {
      const finalImageList = [];
      // 分别上传服务器
      tempImageList.map((item, index) => {
        Taro.uploadFile({
          url: 'http://localhost:5000/manage/img/upload', //仅为示例，非真实的接口地址
          filePath: item,
          name: 'image',
          success(res){
            console.log('upLoadImage-res', res);
            const { status, data } = JSON.parse(res.data);
            if ( status === 0 ){
            // 分别将上传成功后图片的 name 加入 finalImageList 数组中
              finalImageList.push(data.name);
              // 直到最后一个 name 加入 finalImageList 数组再将其返回
              if(index+1 === tempImageList.length){
                // 直接通过 promise 将图片列表返回，在 .then 方法中接收
                resolve(finalImageList);
              }
            }
          }
        });
      });
    });
  };

  // 点击删除图片的回调
  const deleteImage = (name) => {
    const result = [];
    for(let i = 0; i < tempImageList.length; i++){
      // 将被点击之外的图片重新加入新数组 result，在进行 setTempImageList(result)
      if(tempImageList[i] !== name) {
        result.push(tempImageList[i]);
      }
    }
    setTempImageList(result);
  };

  // 服务态度评分改变的回调
  const handleServiceAttitudeRateValueChange = (value) => {
    setServiceAttitudeRateValue(value);
  };

  // 环境设施评分改变的回调
  const handleEnvironmentalFacilityRateValueChange = (value) => {
    setEnvironmentalFacilityRateValue(value);
  };

  return(
    <View className='publish'>
      <View className='textarea-container'>
        <Textarea className='textarea' onBlur={getContent} placeholder='请写下您宝贵的评价...' maxlength='200'></Textarea>
      </View>
      <View className='imageupload-container'>
        <View className='image-list'>
          {
            tempImageList.map((item,index) => {
              return(
                <Image key={index} className='image' src={item}>
                  <Icon className='shanchu' size='20' type='clear' color='red' onClick={()=>{deleteImage(item);}} />
                </Image>
              );
            })
          }
          <View className='iconfont icon-tianjia-' style={{display: tempImageList.length>=9 ?'none':''}} onClick={addImage}></View>
        </View>
      </View>
      <View className='service-attitude-rate'>
        <View className='title'>服务态度评分：</View>
        <AtRate size='20' value={serviceAttitudeRateValue} onChange={handleServiceAttitudeRateValueChange} />
      </View>
      <View className='environmental-facility-rate'>
        <View className='title'>设施环境评分：</View>
        <AtRate size='20' value={environmentalFacilityRateValue} onChange={handleEnvironmentalFacilityRateValueChange} />
      </View>
      <Button className='publish_button' onClick={publish}>发布</Button>
    </View>
  );
};

export default CommentPublish;