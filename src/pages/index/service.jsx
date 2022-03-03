import Request from '../../api/request';

const BASE = 'http://localhost:5000';

// 获取学校列表
const reqSchools = (pageNum, pageSize) => Request(BASE + '/manage/school/list', {pageNum, pageSize});

export default reqSchools;