import Request from '../../api/request';

// 获取学校列表
export const reqSchools = (pageNum, pageSize) => Request('/manage/school/list', {pageNum, pageSize});

// 获取热门学校列表
export const reqHotSchools = (district_name_list) => Request('/manage/school/hot_list', {district_name_list});
