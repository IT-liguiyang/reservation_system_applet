import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';

import { reqDynamicSharingByusername, reqDeleteDynamicSharing } from './service';
import head_image from '../../../static/person-center/my-dynamic.png';
import { BASE_IMG_URL } from '../../../utils/constants';
import './index.less';

const Dynamic = () => {

  const [dynamicObj, setDynamicObj] = useState([]);  // 全部的动态信息

  const userObj_from_storage = Taro.getStorageSync('userObj');
  const { username, realname, head_portrait } = userObj_from_storage || {};

  useEffect(() => {
    getDynamicData();
  }, []);

  // 发布请求，获取动态分享数据
  const getDynamicData = async () => {
    const result = await reqDynamicSharingByusername(username);
    console.log('getDynamicData-result', result.data);
    setDynamicObj(result.data);
  };

  const deleteDynamic = async (dynamic_sharingId) => {
    const result = await reqDeleteDynamicSharing(dynamic_sharingId);
    if(result.status===0) {
      Taro.showToast({
        title: '删除成功',
        icon: 'success'
      });
    }
    const result1 = await reqDynamicSharingByusername(username);
    setDynamicObj(result1.data);
  };

  const back = () => {
    Taro.navigateBack();
  };

  return(
    <View className='dynamic'>
      <View className='iconfont icon-zuojiantou' onClick={back}></View>
      <View className='dynamic-head'>
        <Image className='dynamic-head-image' src={head_image}></Image>
        <View className='my-info'>
          <Image className='my-info-image' src={BASE_IMG_URL+head_portrait}></Image>
          <View className='name'>
            <View className='realname'>{realname}</View>
            <View className='username'>Tel:{username}</View>
          </View>
        </View>
      </View>
      <View className='dynamic-container'>
        {
          dynamicObj.map((item) => {
            return (
              <View key={item._id} className='dynamic-item'>
                <View className='dynamic-item-left'>
                  <Image className='avater' src={BASE_IMG_URL+item.publish_avater[0]}></Image>
                </View>
                <View className='dynamic-item-right'>
                  {/* 姓名区域 */}
                  <Text className='realname'>{item.publish_realname}</Text>
                  {/* 动态内容区域 */}
                  <View className='content'>{item.pub_content[0]}</View>
                  {/* 图片列表区域 */}
                  <View className='image-list'>
                    {
                      item.image_list.map((img, index) => {
                        return(
                          <Image key={index} className='image-list image' src={BASE_IMG_URL+img}></Image>
                        );
                      })
                    }
                  </View>
                  {/* 时间区域 */}
                  <View className='time-area'>
                    {/* 左侧时间显示 */}
                    <View className='time'>{item.pub_time}</View>
                    {/* 右侧（删除）按钮 */}
                    <View className='delete-button' onClick={()=> deleteDynamic(item._id)}>删除</View>
                  </View>
                  {/* 点赞和评论区域 */}
                  <View className='love-comment'>
                    <View className='love' style={{display: item.love.length === 0 ? 'none': ''}}>
                      <View className='iconfont icon-dianzan'></View>
                      <Text className='love-realname'>
                        {
                          item.love.map((name) => {
                            return(
                              name + ' '
                            );
                          })
                        }
                      </Text>
                    </View>
                    {/* 评论区域 */}
                    {
                      item.comment.map((comment, index) => {
                        return (
                          <View  key={index} className='comment'>
                            <View key={index}>
                              <Text className='comment-realname'>{comment.realname+'：'}</Text>
                              <Text className='comment-content'>{comment.commentContent}</Text>
                            </View>
                          </View>
                        );
                      })
                    }
                  </View>
                </View>
              </View>
            );
          })
        }
      </View>
    </View>
  );
};

export default Dynamic;