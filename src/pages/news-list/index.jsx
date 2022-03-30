import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Input, View, Text, Image } from '@tarojs/components';

import { reqNews, reqSearchNews } from './service';

import './index.less';
import newImg from '../../static/news/notfound-img.png';
import { BASE_IMG_URL } from '../../utils/constants';

const NewsList = () => {

  const [ newsList, setNewsList ] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect( async () => {
    // 发送请求
    const result = await reqNews();
    console.log('1111', result.data);

    setNewsList(result.data);
  }, []);

  // 得到图片的路径
  const getImgSrc = (item) => {
    const srcReg = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配src的值
    const src = item.pub_content[0].match(srcReg); 
    const realSrc =  src ? src[1].split('upload/') : ''; // 通过截取得到 image-1647047100634.jpg
    return realSrc[1];
  };

  console.log(newsList);

  const jumpToNewsDetail = (item) => {
    Taro.navigateTo({
      url: '../news/index',
      success: function(res){
        res.eventChannel.emit('acceptData', { data: item });
      }
    });
  };

  // 搜索框失去焦点开始搜索
  const search = async (e) => {
    // 如果关键字为空或者为空格，则不进行搜索并提示用户输入关键字
    if (!e.target.value.trim()) {
      const result = await reqNews();
      setNewsList(result.data);
      return;
    }
    const keyword = e.target.value;
    const searchType = 'newsTheme';
    // 发送请求获取数据
    const result = await reqSearchNews({keyword, searchType});
    setNewsList(result.data);
  };

  return(
    <View className='news-container'>
      <View className='news-header'>
        <Text className='iconfont icon-sousuo icon-search'></Text>
        <Input 
          className='search-input' 
          placeholder='搜索您感兴趣的新闻' 
          placeholderClass='placeholder'  
          onBlur={search}
        ></Input>   
      </View>
      <View className='news-list'>
        {
          newsList.map((item) => {
            return (
              <View key={item._id} className='news-item' onClick={()=>jumpToNewsDetail(item)}>
                <View className='news-item-left'>
                  <View className='news-theme'>{item.pub_theme.length > 23 ? item.pub_theme.slice(0,23)+'...':item.pub_theme}</View>
                  <View className='news-bottom'>
                    <View className='news-bottom-left'>{item.publisher.length>6?item.publisher.slice(0,5)+'...':item.publisher}  {item.real_pub_time}</View>
                    <View className='news-bottom-right'>
                      <Text className='iconfont icon-weixin'></Text>
                      <Text className='news-bottom-right friends'>好友</Text>
                    </View>
                  </View>
                </View>
                <Image className='news-item-image' src={getImgSrc(item) ? (BASE_IMG_URL + getImgSrc(item)) : newImg}></Image>
              </View>
            );
          })
        }
      </View>
    </View>
  );
};

export default NewsList;