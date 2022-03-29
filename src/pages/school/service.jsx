import Request from '../../api/request';

// 通过id查询单条动态信息
export const reqAnnouncementByPublisher = (publisher) => Request('/manage/announcement/search_by_publisher', {publisher});

export default reqAnnouncementByPublisher;