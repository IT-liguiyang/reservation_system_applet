import Request from '../../../api/request';

// 添加动态（用户发布动态分享）
export const reqAddFeedback = (feedbackObj) => Request('/manage/feedback/add', feedbackObj, 'POST');

// 通过id查询单条动态信息
export const reqFeedbackByUsername = (username) => Request('/wechat/feedback/query_by_username', {username}, 'POST');

// 添加动态（用户发布动态分享）
export const reqAddMessage = (messageObj) => Request('/manage/message/add', messageObj, 'POST');
