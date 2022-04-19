import Request from '../../../api/request';

// 通过 手机号查询 用户信息
export const reqMessageByAcceptor = (username) => Request('/wechat/message/list_by_username', {username});

// 更新用户消息信息
export const reqUpdateMessage = ({newMessageObj, messageId}) => Request('/manage/message/update', {newMessageObj, messageId}, 'POST');