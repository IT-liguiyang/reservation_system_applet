import Request from '../../../api/request';

// 添加动态（用户发布动态分享）
export const reqAddDynamicSharing = (dynamic_sharingObj) => Request('/manage/dynamic_sharing/add', dynamic_sharingObj, 'POST');