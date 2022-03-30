import Request from '../../api/request';

// 获取学校列表
export const reqNews = () => Request('/wechat/news/list');

// 获取学校列表
export const reqSearchNews = ({keyword, searchType}) => Request('/wechat/news/search', {[searchType]: keyword,});
