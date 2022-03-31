import { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { AtAccordion } from 'taro-ui';

import { reqCommonProblems } from './service';
import './index.less';

const CommonProblems = () => {

  const [commonProblemsObj, setCommonProblemsObj] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect( async () => {
    const result = await reqCommonProblems();
    console.log('getDynamicData-result', result.data);
    setCommonProblemsObj(result.data);
  }, []);

  const [openItem, setOpenItem] = useState(-1);

  const handleClick = (index) => {
    console.log(index);
    // 如果当前点击的已经展开，再次点击时将其关闭并返回
    if(index === openItem){
      setOpenItem(-1);
      return;
    }
    setOpenItem(index);
  };
  return (
    <View className='common-problems'>
      {
        commonProblemsObj.map((item, index) => {
          return(
            <AtAccordion
              key={index}
              open={openItem === index? true:false}
              onClick={()=>handleClick(index)}
              title={item.pub_theme}
              className='title'
            >
              <View className='content' dangerouslySetInnerHTML={{__html: item.pub_content?item.pub_content[0]:''}}></View>
            </AtAccordion>
          );
        })
      }
    </View>
  );
};

export default CommonProblems;
