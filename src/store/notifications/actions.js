import { GET_NOTIFICATIONS, GET_NOTIFICATIONS_SUCCESS, GET_NOTIFICATIONS_FAIL } from './actionTypes';

export const getNotifications = () => ({ type: GET_NOTIFICATIONS });
export const getNotificationsSuccess = (data) => ({ type: GET_NOTIFICATIONS_SUCCESS, payload: data });
export const getNotificationsFail = (error) => ({ type: GET_NOTIFICATIONS_FAIL, payload: error }); 