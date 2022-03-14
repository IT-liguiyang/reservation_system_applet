import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { View, Text, Picker, Input } from '@tarojs/components';

import SchoolItem from '../../components/SchoolItem';
import reqSearchSchools from './service';
import './index.less';

const Search = () => {

  const [ selector ] = useState(['学校', '区域', '场馆']);  // 设置选择的所有值
  const [ selectorChecked, setSelectorChecked ] = useState('学校'); // 设置当前值
  const [ showPullDown, setShowPullDown ] = useState(false); // 设置下拉箭头的状态
  const [ showPullUp, setShowPullUp ] = useState(true); // 设置上来箭头的状态
  const [ searchTypeIndex, setSearchTypeIndex ] = useState('0'); // 设置搜索类型的索引
  const [ schoolList, setSchoolList ] = useState([]); // 搜索得到的学校列表

  const goBack = () => {
    Taro.switchTab({
      url:'../index/index'
    });
  };

  // 点击选择时箭头的交替显示
  const handleClick = () => {
    setShowPullDown(!showPullDown);
    setShowPullUp(!showPullUp);
  };

  // 取消选择
  const cancelSelect = () => {
    setShowPullDown(!showPullDown);
    setShowPullUp(!showPullUp); 
  };
  
  // 选择的监听函数
  const pickerOnchange = (e) => {
    setSearchTypeIndex(e.detail.value);  // e.detail 获取当前选项的索引
    setShowPullDown(!showPullDown);
    setShowPullUp(!showPullUp); 
    setSelectorChecked(selector[e.detail.value]);  // 设置选择的值
  };

  // 实时监听showPullDown, showPullUp, searchTypeIndex的变化，setState后立即得到最新值渲染更新
  useEffect(() => {
  }, [showPullDown, showPullUp, searchTypeIndex]);

  // 搜索框失去焦点开始搜索
  const search = async (e) => {
    // 如果关键字为空或者为空格，则不进行搜索并提示用户输入关键字
    if (!e.target.value.trim()) {
      Taro.showToast({
        title: '请先输入关键字！'
      });
      return;
    }
    const keyword = e.target.value;
    const pageNum = 1;
    const pageSize = 6;
    console.log(searchTypeIndex);

    const searchType = getSearchType(searchTypeIndex);

    // 发送请求获取数据
    const result = await reqSearchSchools({pageNum, pageSize, keyword, searchType});

    setSchoolList(result.data.list);
  };

  // 通过索引得到搜索的类型
  const getSearchType = () => {
    if(searchTypeIndex === '0') {
      return 'schoolName';
    } else if(searchTypeIndex === '1') {
      return 'schoolDistrict';
    } else if(searchTypeIndex === '2') {
      return 'openAreas';
    }
  };

  return(
    <View className='index'>
      <View className='index-head'>
        <View className='index-head-serach'>
          <Picker 
            className='picker-container' 
            mode='selector' 
            range={selector} 
            onClick={handleClick} 
            onChange={pickerOnchange} 
            onCancel={cancelSelect}
          >
            <View className='picker-item'>{selectorChecked}</View>
          </Picker>
          <Text className={showPullUp ? 'iconfont icon-shangla':'iconfont icon-shangla show'}></Text>
          <Text className={showPullDown ? 'iconfont icon-xiala':'iconfont icon-xiala show'}></Text>
          <View className='input-container'>
            <Text className='iconfont icon-sousuo icon-search'></Text>
            <Input className='search-input' placeholder='请输入搜索关键字' placeholderClass='placeholder' onBlur={search}></Input>   
          </View>
        </View>
        <Text className='cancel-button' onClick={goBack}>取消</Text>
      </View>
      <View  className='school-list' >
        <SchoolItem schoolList={schoolList} />
      </View>
    </View>
  );
};

export default Search;