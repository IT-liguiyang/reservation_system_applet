import Request from '../../../api/request';

// 通过预订人手机号查询预约信息
export const reqPersonalReservationInfo = (username) => Request('/manage/reservation_info/list_by_username', {username});

// 更新 status
export const reqUpdateStatus = ({status, reservation_infoId}) => Request('/manage/reservation_info/update_status', {status, reservation_infoId}, 'POST');

// 获取预约设置列表
export const reqBookingInfoBySchoolId = (school_id) => Request('/manage/booking_info/search_by_school_id', {school_id});

// 通过学校 id 更新预约设置的 open_info
export const reqUpdateOpenInfoInfoBySchoolId = ({newOpenInfo, school_id}) => Request('/manage/booking_info/update_open_info', {newOpenInfo, school_id}, 'POST');

// 获取预约设置列表
export const reqSchoolInfoById = (school_id) => Request('/manage/school_info_by_id', {school_id});

