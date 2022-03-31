import Request from '../../../api/request';

// 删除动态分享
export const reqDeleteDynamicSharing = (dynamic_sharingId) => Request('/manage/dynamic_sharing/delete', {dynamic_sharingId}, 'POST');

// 通过id查询单条动态信息
export const reqDynamicSharingByusername = (username) => Request('/manage/dynamic_info_by_username', {username}, 'POST');

