import { useState, useEffect } from 'react';
import { Input, View, Text, Image } from '@tarojs/components';

import reqNews from './service';

import './index.less';
import newImg from '../../static/news/notfound-img.png';

const News = () => {

  const [ newsList, setNewsList ] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect( async () => {
    // 发送请求
    const result = await reqNews(1, 6);
    console.log('1111', result.data.list);

    setNewsList(result.data.list);
  }, []);

  console.log(newsList);

  return(
    <View className='news-container'>
      <View className='news-header'>
        <Text className='iconfont icon-sousuo icon-search'></Text>
        <Input className='search-input' placeholder='搜索您感兴趣的新闻' placeholderClass='placeholder'></Input>   
      </View>
      <View className='news-list'>
        {
          newsList.map((item) => {
            return (
              <View key={item._id} className='news-item'>
                <View className='news-item-left'>
                  <View className='news-theme'>{item.pub_theme.length > 23 ? item.pub_theme.slice(0,23)+'...':item.pub_theme}</View>
                  <View className='news-bottom'>
                    <View className='news-bottom-left'>{item.publisher.length>6?item.publisher.slice(0,6)+'...':item.publisher}  {item.pub_time.slice(5,11)}</View>
                    <View className='news-bottom-right'>
                      <Text className='iconfont icon-weixin'></Text>
                      <Text className='news-bottom-right friends'>好友</Text>
                    </View>
                  </View>
                </View>
                <Image className='news-item-image' src={newImg}></Image>
              </View>
            );
          })
        }
      </View>
    </View>
  );
};

export default News;