import Request from '../../../api/request';

// 添加动态（用户发布动态分享）
export const reqAddReservationInfo = (reservationInfoObj) => Request('/manage/reservation_info/add', reservationInfoObj, 'POST');

// 通过学校 id 查询预约设置
export const reqBookingInfoBySchoolId = (school_id) => Request('/manage/booking_info/search_by_school_id', {school_id});

// 通过学校 id 更新预约设置的 open_info
export const reqUpdateOpenInfoInfoBySchoolId = ({newOpenInfo,school_id}) => Request('/manage/booking_info/update_open_info', {newOpenInfo, school_id}, 'POST');
