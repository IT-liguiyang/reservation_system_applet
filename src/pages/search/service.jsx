import Request from '../../api/request';

// 获取学校列表
export const reqSearchSchools = ({pageNum, pageSize, keyword, searchType}) => Request('/manage/school/search', {
  pageNum,
  pageSize,
  [searchType]: keyword,
});
export default reqSearchSchools;