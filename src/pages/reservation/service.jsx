import Request from '../../api/request';

// 通过学校 id 查询预约设置
export const reqBookingInfoBySchooId = (school_id) => Request('/manage/booking_info/search_by_school_id', {school_id});
