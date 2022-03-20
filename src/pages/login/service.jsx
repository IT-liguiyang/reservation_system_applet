import Request from '../../api/request';

// 添加学校
export const reqAddUser = (userObj) => Request('/manage/user/add', userObj, 'POST');

// 获取当前登录的用户信息
export const reqUserCurrent = (username) => Request('/manage/user/current', {username});