import Request from '../../api/request';

// 获取当前登录的用户信息
export const reqUserCurrent = (username) => Request('/manage/user/current', {username});

// 删除指定名称的图片
export const reqDeleteImg = (name) => Request('/manage/img/delete', {name}, 'POST');

// 更新用户
export const reqUpdateUser = ({userObj, userId}) => Request('/manage/user/update', {userObj, userId}, 'POST');

// 获取当前登录的用户信息
export const reqUnreadMessage = () => Request('/manage/message/unread_list');
