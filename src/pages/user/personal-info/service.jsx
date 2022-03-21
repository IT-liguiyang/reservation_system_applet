import Request from '../../../api/request';

// 更新用户
export const reqUpdateUser = ({userObj, userId}) => Request('/manage/user/update', {userObj, userId}, 'POST');