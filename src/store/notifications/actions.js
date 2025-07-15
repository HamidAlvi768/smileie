import { GET_NOTIFICATIONS, GET_NOTIFICATIONS_SUCCESS, GET_NOTIFICATIONS_FAIL, MARK_NOTIFICATION_READ } from './actionTypes';

export const getNotifications = () => ({ type: GET_NOTIFICATIONS });
export const getNotificationsSuccess = (data) => ({ type: GET_NOTIFICATIONS_SUCCESS, payload: data });
export const getNotificationsFail = (error) => ({ type: GET_NOTIFICATIONS_FAIL, payload: error });

export const markNotificationRead = (id) => ({
  type: MARK_NOTIFICATION_READ,
  payload: id,
}); 