import Request from '../../api/request';

// 通过id查询单条动态信息
export const reqAnnouncementByPublisher = (publisher) => Request('/manage/announcement/search_by_publisher', {publisher});

// 通过学校 id 查询预约设置
export const reqBookingInfoBySchooId = (school_id) => Request('/manage/booking_info/search_by_school_id', {school_id});

// 通过学校 id 查询预约信息
export const reqReservationInfoBySchoolId = (school_id) => Request('/manage/reservation_info/list_by_school_id', {school_id});
