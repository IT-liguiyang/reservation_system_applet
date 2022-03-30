import Request from '../../api/request';

// 获取所有学校列表
export const reqSchools = (pageNum, pageSize) => Request('/manage/school/list', {pageNum, pageSize});

// 获取学校列表
export const reqSearchSchools = ({pageNum, pageSize, keyword, searchType}) => Request('/manage/school/search', {
  pageNum,
  pageSize,
  [searchType]: keyword,
});