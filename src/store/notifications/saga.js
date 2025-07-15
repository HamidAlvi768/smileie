import { call, put, takeLatest } from 'redux-saga/effects';
import { GET_NOTIFICATIONS } from './actionTypes';
import { getNotificationsSuccess, getNotificationsFail } from './actions';
import axios from 'axios';

// API endpoint
const NOTIFICATIONS_API = 'https://smileie.jantrah.com/backend/api/notifications';

function* fetchNotifications() {
  try {
    const response = yield call(axios.get, NOTIFICATIONS_API);
    // API returns { status, code, data: [ { notification, user } ] }
    const notifications = (response.data || []).map(item => ({
      id: item.notification.id,
      title: item.notification.title,
      message: item.notification.message,
      date: item.notification.created_at,
      ...item.notification,
      user: item.user
    }));
    yield put(getNotificationsSuccess(notifications));
  } catch (error) {
    yield put(getNotificationsFail(error.message || 'Failed to fetch notifications'));
  }
}

export default function* notificationsSaga() {
  yield takeLatest(GET_NOTIFICATIONS, fetchNotifications);
}
