import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { View, Text, Picker, Input, Image, Button } from '@tarojs/components';

import SchoolItem from '../../components/SchoolItem';
import { reqSchools, reqSearchSchools } from './service';
import './index.less';
import headImage from '../../static/school-list/school-list-head.png';

const SchoolList = () => {

  const [ selector ] = useState(['学校', '区域', '场馆']);  // 设置选择的所有值
  const [ selectorChecked, setSelectorChecked ] = useState('学校'); // 设置当前值
  const [ showPullDown, setShowPullDown ] = useState(false); // 设置下拉箭头的状态
  const [ showPullUp, setShowPullUp ] = useState(true); // 设置上来箭头的状态
  const [ searchTypeIndex, setSearchTypeIndex ] = useState('0'); // 设置搜索类型的索引
  const [ schoolList, setSchoolList ] = useState([]); // 搜索得到的学校列表
  const [ activeLabelIndex, setActiveLabelIndex ] = useState(0); // 搜索得到的学校列表

  // 点击取消的回调
  const cancelSearch = async () => {
    // 如果搜索框为空则直接返回，避免多余的请求
    if(document.getElementById('search-input').value = ''){
      console.log(1111111111);
      return;
    }
    // 将搜索框清空
    document.getElementById('search-input').value = '';
    // 搜索全部数据
    const result = await reqSchools(1, 6);
    setActiveLabelIndex(0);
    setSchoolList(result.data.list);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect( async () => {
    const result = await reqSchools(1, 6);
    setSchoolList(result.data.list);
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

  // 点击某个 label 的回调，通过 index 判断点击的是哪个
  const labelOnClick = async (index) => {
    const districList = ['全部','市直属','观山湖区','云岩区','南明区','乌当区','白云区','花溪区','贵安新区','清镇市','修文县','开阳县','息烽县'];
    setActiveLabelIndex(index);

    // 如果 index===0 则为搜索所有区域的学校
    if(index ===0){
      const result = await reqSchools(1, 6);
      setSchoolList(result.data.list);
      return;
    }

    // 搜索指定区域的学校
    const pageNum = 1;
    const pageSize = 6;
    const keyword = districList[index];
    const searchType = 'schoolDistrict';
    // 发送请求获取数据
    const result = await reqSearchSchools({pageNum, pageSize, keyword, searchType});
    setSchoolList(result.data.list);
  };

  return(
    <View className='index'>
      <View className='head-image'>
        <Image className='img' src={headImage}></Image>
      </View>
      <View className='search'>
        <View className='search-container'>
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
            <Input id='search-input' className='search-input' placeholder='请输入搜索关键字' placeholderClass='placeholder' onBlur={search}></Input>   
          </View>
        </View>
        <Text className='cancel-button' onClick={cancelSearch}>取消</Text>
      </View>
      <View className='district-choice'>
        <Button className={activeLabelIndex===0?'choice-label-all active':'choice-label-all'} onClick={() => labelOnClick(0)} size='mini'>全部</Button>
        <Button className={activeLabelIndex===1?'choice-label active':'choice-label'} onClick={() => labelOnClick(1)} size='mini'>市直属</Button>
        <Button className={activeLabelIndex===2?'choice-label active':'choice-label'} onClick={() => labelOnClick(2)} size='mini'>观山湖区</Button>
        <Button className={activeLabelIndex===3?'choice-label active':'choice-label'} onClick={() => labelOnClick(3)} size='mini'>云岩区</Button>
        <Button className={activeLabelIndex===4?'choice-label active':'choice-label'} onClick={() => labelOnClick(4)} size='mini'>南明区</Button>
        <Button className={activeLabelIndex===5?'choice-label active':'choice-label'} onClick={() => labelOnClick(5)} size='mini'>乌当区</Button>
        <Button className={activeLabelIndex===6?'choice-label active':'choice-label'} onClick={() => labelOnClick(6)} size='mini'>白云区</Button>
        <Button className={activeLabelIndex===7?'choice-label active':'choice-label'} onClick={() => labelOnClick(7)} size='mini'>花溪区</Button>
        <Button className={activeLabelIndex===8?'choice-label active':'choice-label'} onClick={() => labelOnClick(8)} size='mini'>贵安新区</Button>
        <Button className={activeLabelIndex===9?'choice-label active':'choice-label'} onClick={() => labelOnClick(9)} size='mini'>清镇市</Button>
        <Button className={activeLabelIndex===10?'choice-label active':'choice-label'} onClick={() => labelOnClick(10)} size='mini'>修文县</Button>
        <Button className={activeLabelIndex===11?'choice-label active':'choice-label'} onClick={() => labelOnClick(11)} size='mini'>开阳县</Button>
        <Button className={activeLabelIndex===12?'choice-label active':'choice-label'} onClick={() => labelOnClick(12)} size='mini'>息烽县</Button>
      </View>
      <View  className='school-list' >
        <SchoolItem schoolList={schoolList} />
      </View>
    </View>
  );
};

export default SchoolList;