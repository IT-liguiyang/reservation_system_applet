import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Textarea, Button, Icon } from '@tarojs/components';

import moment from 'moment';

import { reqAddDynamicSharing } from './service';
import './index.less';

const DynamicPublish = () => {

  const [tempImageList, setTempImageList] = useState([]);  // 临时存放图片的数组
  const [input_content, setInputContent] = useState(''); // 发布的内容

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
    const { username, realname, head_portrait } = Taro.getStorageSync('userObj');

    // 1.准备数据
    console.log('finalImageList', finalImageList);
    const dynamicObj = {
      publish_username: username,  // 发布人(手机号)
      publish_realname: realname,  // 发布人(姓名)
      publish_avater: head_portrait,  // 发布人头像
      pub_time: moment().format('YYYY-MM-DD HH:mm'),  // 发布时间
      pub_content: input_content,  // 内容
      image_list: finalImageList,  // 图片（数组） 
      love: [],  // 点赞（存放点赞人姓名的数组）
      comment: [] // 评论（数组），存放 key-value ，如 ['发布人姓名': '内容']
    };

    // 2.发送请求
    const result = await reqAddDynamicSharing(dynamicObj);
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

  return(
    <View className='publish'>
      <View className='textarea-container'>
        <Textarea className='textarea' onBlur={getContent} placeholder='这一刻的想法...' maxlength='200'></Textarea>
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
      <Button className='publish_button' onClick={publish}>发布</Button>
    </View>
  );
};

export default DynamicPublish;