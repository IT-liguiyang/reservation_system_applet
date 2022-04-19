import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import { reqMessageByAcceptor, reqUpdateMessage } from './service';

import './index.less';

const Reservation = () => {
  
  const [ messageObj, setMessageObj ] = useState([]);  // 存放消息对象

  const userObj_from_storage = Taro.getStorageSync('userObj');
  const { username } = userObj_from_storage || {};

  useEffect(() => {
    getMessage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取消息
  const getMessage = async () => {
    const result = await reqMessageByAcceptor(username);
    console.log(result);
    setMessageObj(result.data);
  };

  // 更新消息是否已读
  const readMessage = async (item) => {
    console.log('item', item);
    // 如果已经为已读，则点击后直接返回
    if(item.isRead === '1') return;
    const newMessageObj = {
      'publisher': item.publisher,
      'acceptor': item.acceptor, 
      'pub_content': item.pub_content,
      'pub_time': item.pub_time,
      'isRead': '1'
    };
    const messageId = item._id;
    const result = await reqUpdateMessage({newMessageObj, messageId});
    console.log(result);
    if(result.status === 0) getMessage();
  };

  console.log('messageObj', messageObj);

  return(
    <View className='message'>
      
      {
        messageObj.length>0? (
          messageObj.map((item) => {
            return(
              <View key={item._id} className='message-item' onClick={()=> readMessage(item)}>
                <View className='container'>
                  <View className='publisher'>【{item.publisher}】</View>
                  {
                    item.isRead === '0' ? (<View className='iconfont icon-tubiaozhizuo-'></View>):''
                  }
                  <View className='content' dangerouslySetInnerHTML={{__html: item.pub_content[0]}}></View>
                </View>
                <View className='datetime'>{item.pub_time.slice(0,16)}</View>
              </View>
            );
          })
        ):(
          <View className='noDate'>
            <View className='iconfont icon-wushuju'></View>
            <View className='noDate-text'>暂无数据</View>
          </View>
        )
      }
    </View>
  );
};

export default Reservation;