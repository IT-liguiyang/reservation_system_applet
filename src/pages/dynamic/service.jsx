import Request from '../../api/request';

// 获取动态分享列表
export const reqDynamicSharings = () => Request('/wechat/dynamic_sharing/list');

// 更新动态分享信息
export const reqUpdateDynamicSharing = ({dynamic_sharingObj, dynamic_sharingId}) => Request('/manage/dynamic_sharing/update', {dynamic_sharingObj, dynamic_sharingId}, 'POST');

// 通过id查询单条动态信息
// export const reqSingleDynamicSharing = (dynamic_sharingId) => Request('/manage/dynamic_info_by_id', {dynamic_sharingId}, 'POST');

