import { useState } from 'react';
import Taro from '@tarojs/taro';
import { AtTabs, AtTabsPane } from 'taro-ui';
import { 
  View, 
  Image, 
  Textarea, 
  Button, 
  Icon, 
  Input, 
  RadioGroup, 
  Radio,
  Text
} from '@tarojs/components';

import moment from 'moment';
import { BASE_IMG_URL } from '../../../utils/constants';
import { reqAddFeedback, reqFeedbackByUsername } from './service';
import './index.less';

const Feedback = () => {

  const [ tempImageList, setTempImageList ] = useState([]);  // 临时存放图片的数组
  const [ input_content, setInputContent ] = useState(''); // 发布的内容
  const [ feedbackType, setFeedbackType ] = useState(''); // 发布的内容
  const [ feedbackAcceptor, setFeedbackAcceptor ] = useState(''); // 发布的内容
  const [ acticeBar, setActiceBar ] = useState(0);  // 设置当前选择的tab
  const [ myFeedbackList, setMyFeedbackList ] = useState([]);  // 设置当前选择的tab

  // 得到输入的受理人
  const getAcceptor = (e) => {
    setFeedbackAcceptor(e.detail.value);
  };

  // 得到意见反馈类型
  const getFeedbackType = (e) => {
    setFeedbackType(e.detail.value);
  };

  // 失去焦点直接先获取用户输入的动态内容
  const getContent = (e) => {
    setInputContent(e.detail.value);
  };

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
  const feedback = async () => {
    // 接收 upLoadImage() 对象中返回的包含图片名称的 imageList，以便传入 postRequest中使用
    upLoadImage().then((finalImageList) => {
      postRequest(finalImageList);
    }).catch((err) => {
      console.log(err);
    });

  };

  const postRequest = async (finalImageList) => {
    const { username, realname } = Taro.getStorageSync('userObj');

    // 1.准备数据
    console.log('finalImageList', finalImageList);
    const dynamicObj = {
      pub_username: username,  // 发布人(手机号)
      pub_realname: realname,  // 发布人(姓名)
      type: feedbackType,
      acceptor: feedbackAcceptor,
      pub_time: moment().format('YYYY-MM-DD HH:mm'),  // 发布时间
      pub_content: input_content,  // 内容
      image_list: finalImageList,  // 图片（数组） 
    };

    // 2.发送请求
    const result = await reqAddFeedback(dynamicObj);
    console.log('postRequest-res', result);
    
    // 3. 提示发布成功并跳转
    if(result.status === 0) {
      Taro.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 1500
      });
      setTimeout(() => {
        // 使跳转后自动重新获取数据
        Taro.switchTab({
          url: '../index',
          success:  () => { 
            // 认证成功，跳转至动态首页后需要刷新页面，否则无法拿到最新发布的动态
            const page = Taro.getCurrentPages().pop();
            page.onLoad(); 
          } 
        });
        
      }, 1500);
    }
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

  const handleClick = async (value) => {
    const { username } = Taro.getStorageSync('userObj');
    setActiceBar(value);
    if(value === 1 && myFeedbackList.length ===0 ) {
      const result = await reqFeedbackByUsername(username);
      setMyFeedbackList(result.data);
    }
  };

  const tabList = [{ title: '发布意见反馈' }, { title: '我的意见反馈' }];

  return(
    <View className='feedback'>
      <AtTabs current={acticeBar} tabList={tabList} onClick={handleClick}>
        <AtTabsPane className='publish' current={acticeBar} index={0}>
          <View className='acceptor'>
            <Text className='acceptor-title'>请输入反馈意见的受理人：</Text>
            <Input className='acceptor-input' onBlur={getAcceptor} placeholder='管理员或者学校名称' placeholderClass='placeholderClass'></Input>
          </View>
          <View className='feedback-type'>
            <Text className='type-title'>请选择反馈的意见类型：</Text>
            <RadioGroup className='radio-group' onChange={getFeedbackType}>
              <Radio className='radio-list__radio' value='功能异常'>功能异常</Radio>
              <Radio className='radio-list__radio' value='服务态度'>服务态度</Radio>
              <Radio className='radio-list__radio' value='设施安全'>设施安全</Radio>
              <Radio className='radio-list__radio' value='其他'>其他</Radio>
            </RadioGroup>
          </View>
          <View className='textarea-container'>
            <Text className='textarea-title'>意见描述：</Text>
            <Textarea className='textarea' onBlur={getContent} placeholder='请输入您的建议或遇到的问题' placeholderClass='placeholderClass' maxlength='200'></Textarea>
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
          <Button className='feedback_button' onClick={feedback}>发布</Button>
        </AtTabsPane>
        <AtTabsPane className='my-feedback' current={acticeBar} index={1}>
          {
            myFeedbackList.map((item) => {
              return (
                <View key={item._id} className='feedback-item'>
                  <View className='text'>
                    <View className='has-accept'>已受理</View>
                    <View className='pub_username'>姓&nbsp;&nbsp;&nbsp;名：{item.pub_realname}</View>
                    <View className='pub_realname'>手机号：{item.pub_username}</View>
                    <View className='acceptor'>反馈意见受理人：{item.acceptor}</View>
                    <View className='type'>反馈意见类型：{item.type}</View>
                    {/* <View className='type'>反馈意见类型：{item.type}</View> */}
                    <View className='pub_content' dangerouslySetInnerHTML={{__html: item.pub_content}}></View>
                  </View>
                  <View className='image-list'>
                    {
                      item.image_list.map((img, index) => {
                        return(
                          <Image key={index} className='image-list image' src={BASE_IMG_URL+img}></Image>
                        );
                      })
                    }
                  </View>
                  <View className='time'>发布日期：{item.pub_time}</View>
                </View>
              );
            })
          }
        </AtTabsPane>
      </AtTabs>
    </View>
  );
};

export default Feedback;