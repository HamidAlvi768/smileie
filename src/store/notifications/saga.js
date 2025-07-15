import { call, put, takeLatest } from 'redux-saga/effects';
import { GET_NOTIFICATIONS, MARK_NOTIFICATION_READ, MARK_NOTIFICATION_READ_SUCCESS, MARK_NOTIFICATION_READ_FAIL } from './actionTypes';
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

function* markNotificationReadSaga(action) {
  try {
    const id = action.payload;
    yield call(axios.get, `https://smileie.jantrah.com/backend/api/notifications/read?id=${id}`);
    yield put({ type: MARK_NOTIFICATION_READ_SUCCESS, payload: id });
  } catch (error) {
    yield put({ type: MARK_NOTIFICATION_READ_FAIL, payload: error.message });
  }
}

export default function* notificationsSaga() {
  yield takeLatest(GET_NOTIFICATIONS, fetchNotifications);
  yield takeLatest(MARK_NOTIFICATION_READ, markNotificationReadSaga);
}
