import Request from '../../api/request';

// 获取学校列表
const reqSchools = (pageNum, pageSize) => Request('/manage/school/list', {pageNum, pageSize});

export default reqSchools;