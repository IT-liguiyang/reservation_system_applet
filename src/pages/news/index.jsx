import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import './index.less';

const News = () => {

  const [ newsObj, setNewsObj ] = useState({});

  useEffect(() => {

    // 得到点击页面传过来的一个学校对象 item
    const pages = Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.on('acceptData', (data) => {
      console.log('接收到的新闻对象', data.data);
      setNewsObj(data.data);
    });
  }, []);

  console.log(newsObj);

  const { 
    publisher, 
    real_pub_time,
    origin,
    pub_theme, 
    pub_content, 
  } = newsObj || {};

  return(
    <View className='news'>
      <Text className='news-title'>{pub_theme ? pub_theme:''}</Text>
      <View className='news-content' dangerouslySetInnerHTML={{__html: pub_content?pub_content[0]:''}}></View>
      <View className='news-bottom'>
        <View>发布人：{publisher? publisher:''}</View>
        <View>发布时间：{real_pub_time ? real_pub_time : ''}</View>
        <View>来源：{origin ? origin : ''}</View>
      </View>
    </View>
  );
};

export default News;