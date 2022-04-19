import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text, Input, Button } from '@tarojs/components';

import { reqDynamicSharings, reqUpdateDynamicSharing } from './service';
import { BASE_IMG_URL } from '../../utils/constants';
import head_image from '../../static/dynamic/sports2.png';
import './index.less';

const Dynamic = () => {

  const [dynamicObj, setDynamicObj] = useState([]);  // 全部的动态信息
  const [isShowOperationPannel, setIsShowOperationPannel] = useState('none'); // 是否显示点赞和评论的操作面板
  const [isGiveLove, setIsGiveLove] = useState(false);  // 是否点赞
  const [commentContent, setCommentContent ] = useState('');  // 评论的内容
  const [isShowCommentAdd, setIsShowCommentAdd ] = useState('none');  // 是否显示评论输入框
  const [currenrClickItem, setCurrenrClickItem] = useState('');  // 暂存当前点击那条动态
  const [currenrCommentDynamic, setCurrenrCommentDynamic] = useState([]);  // 暂存当前点击那条动态的 _id

  const userObj_from_storage = Taro.getStorageSync('userObj');
  const { head_portrait, realname } = userObj_from_storage || {};

  useEffect(() => {
    getDynamicData();
  }, []);

  // 发布请求，获取动态分享数据
  const getDynamicData = async () => {
    const result = await reqDynamicSharings(1, 6);
    console.log('getDynamicData-result', result.data);
    setDynamicObj(result.data);
  };

  // 控制点赞和评论面板的显示和隐藏
  const showOperationPannel = (item) => {
    // 暂存当前点击那条动态
    setCurrenrClickItem(item);

    // 再次点击，若已经显示，则将其隐藏
    if(isShowOperationPannel === 'block') {
      setIsShowOperationPannel('none');
      return;
    }
    setIsShowOperationPannel('block');
  };

  // 跳转到 个人中心 我的动态 页面
  const goMyReservation = () => {
    Taro.navigateTo({
      url: '../user/my-dynamic/index'
    });
  };

  // 跳转到发布动态页面
  const goPublish = () => {
    Taro.navigateTo({
      url: './publish/index'
    });
  };

  // 点赞
  const giveLove = async (item) => {
    console.log(isGiveLove);
    
    // 得到当前点击的、原本的动态对象
    const { 
      _id, 
      publish_username, 
      publish_realname, 
      publish_avater, 
      pub_time, 
      pub_content, 
      image_list,
      love,
      comment
    } = item;

    // 若当前用户不在点赞列表则将其加入，操作由 ‘点赞’ 变为 ‘取消’
    if(love.indexOf(realname) === -1){
      console.log('点赞---取消');
      love.push(realname);
      setIsGiveLove(true);
    } else {
      // 若当前用户在点赞列表则将其删除加入，操作由 ‘取消’ 变为 ‘点赞’
      console.log('取消---点赞');
      love.splice(love.indexOf(realname), 1);
      setIsGiveLove(false);
    }

    // 构造新的对象用户更新
    const dynamic_sharingObj = {
      publish_username, 
      publish_realname, 
      publish_avater, 
      pub_time, 
      pub_content, 
      image_list,
      love,
      comment
    };

    // 保存 id，使其命名与接口中保持一致
    const dynamic_sharingId = _id;
    const result = await reqUpdateDynamicSharing({dynamic_sharingObj, dynamic_sharingId});
    console.log(result);

    // 隐藏点赞和评论的操作面板
    const timer = setInterval(() => {
      setIsShowOperationPannel('none');
      clearInterval(timer);
    }, 800);
    
  };

  // 点击评论的方法
  const giveComment = async (item) => {
    console.log('giveComment');
    // 隐藏点赞和评论的操作面板
    setIsShowOperationPannel('none');
    // 显示评论输入框
    setIsShowCommentAdd('flex'); // 设置显示输入框，不能改为'block', 否则样式混乱

    // 得到点击评论的对象
    setCurrenrCommentDynamic(item);
  };

  // 获取输入的值
  const onInput = (e) => {
    console.log(e.detail.value);
    // 保存评论输入框的值
    setCommentContent(e.detail.value);
  };

  // 发布评论 
  const clickSend = async () => {
    console.log('发布评论');
    // 构造评论对象

    const { 
      _id, 
      publish_username, 
      publish_realname, 
      publish_avater, 
      pub_time, 
      pub_content, 
      image_list,
      love,
      comment
    } = currenrCommentDynamic;

    // 构造一条评论的对象
    const one_comment_obj = {
      realname,
      commentContent
    };
    // 将新的评论对象加入评论列表
    comment.push(one_comment_obj);

    const dynamic_sharingObj = {
      publish_username, 
      publish_realname, 
      publish_avater, 
      pub_time, 
      pub_content, 
      image_list,
      love,
      comment
    };

    const dynamic_sharingId = _id;
    const result = await reqUpdateDynamicSharing({dynamic_sharingObj, dynamic_sharingId});
    console.log(result);
    
    // 隐藏评论框
    setIsShowCommentAdd('none');
    // 清空评论框
    document.getElementById('comment-input').value='';
  };

  // 取消评论，隐藏评论框
  const cancelPublishComment = () => {
    // 隐藏评论框
    setIsShowCommentAdd('none');
  };

  return(
    <View className='dynamic'>
      <View className='dynamic-head'>
        <Image className='dynamic-head-image' src={head_image}></Image>
        <View>
          <View className='my-info' onClick={goMyReservation}>
            <Image className='my-info-image' src={BASE_IMG_URL+head_portrait}></Image>
          </View>
          <View className='go-publish' onClick={goPublish}>
            <View className='iconfont icon-xiangji'></View>
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
                    {/* 右侧（点赞和评论）操作按钮和操作面板 */}
                    <View>
                      <View className='iconfont icon-gengduo operation-button' onClick={()=>{showOperationPannel(item._id);}}></View>
                      <View id='operation-pannel' className='operation-pannel' style={{display: item._id === currenrClickItem ? isShowOperationPannel: ''}}>
                        <View className='tab' onClick={()=>giveLove(item)}>
                          <View className='iconfont icon-dianzan'></View>
                          <Text id='dianzan'>
                            {
                              item.love.indexOf(realname) === -1 ? '点赞':'取消'
                            }
                            {/* {isGiveLove === false ? '点赞':'取消'} */}
                          </Text>
                        </View>
                        <View className='tab' onClick={()=> giveComment(item)}>
                          <View className='iconfont icon-pinglun'></View>
                          <Text>评论</Text>
                        </View>
                      </View>
                    </View>
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
      <View className='comment-add' style={{display: isShowCommentAdd}}>
        <Input id='comment-input' className='comment-input' placeholder='发表您的评论' placeholderClass='placeholderClass' onInput={onInput}></Input>
        <Text className='cancelBtn' onClick={cancelPublishComment}>取消</Text>
        <Button className='comment-send' type='primary' disabled={commentContent.length>0 ? false:true} size='mini' onClick={clickSend}>发 送</Button>
      </View>
    </View>
  );
};

export default Dynamic;