import Request from '../../api/request';

// 通过学校 id 查询预约设置
export const reqBookingInfoBySchooId = (school_id) => Request('/manage/booking_info/search_by_school_id', {school_id});

// 更新动态分享信息
export const reqUpdateDynamicSharing = ({dynamic_sharingObj, dynamic_sharingId}) => Request('/manage/dynamic_sharing/update', {dynamic_sharingObj, dynamic_sharingId}, 'POST');

// 通过id查询单条动态信息
// export const reqSingleDynamicSharing = (dynamic_sharingId) => Request('/manage/dynamic_info_by_id', {dynamic_sharingId}, 'POST');

