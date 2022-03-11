import Request from '../../api/request';

// 获取学校列表
const reqNews = (pageNum, pageSize) => Request('/manage/news/list', {pageNum, pageSize});

export default reqNews;