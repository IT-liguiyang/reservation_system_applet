import { Component } from 'react';
import Taro from '@tarojs/taro';

import 'taro-ui/dist/style/index.scss'; // 全局引入一次即可
import './app.less';
import './static/iconfont/iconfont.css'; // 引入全局的icon样式
import './utils/mtj-wx-sdk';

class App extends Component {

  componentDidMount () {
    Taro.cloud.init({
      env: 'reservation-system-7diwnb2d9a3a5'
    });
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children;
  }
}

export default App;
