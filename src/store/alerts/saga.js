import { call, put, takeLatest } from 'redux-saga/effects';
import { GET_ALERTS, MARK_ALERT_READ } from '../notifications/actionTypes';
import { getAlertsSuccess, getAlertsFail, markAlertReadSuccess, markAlertReadFail } from './actions';
import { getAlertsAPI } from '../../helpers/api_helper';
import axios from 'axios';

function* fetchAlerts(action) {
  try {
    const { userId, params } = action.payload;
    const response = yield call(getAlertsAPI, userId, params);
    // API returns { status, code, data: [ { notification, user } ], pagination }
    const alerts = (response.data || []).map(item => ({
      id: item.notification.id,
      title: item.notification.title,
      message: item.notification.description,
      created_at: item.notification.created_at,
      read_at: item.notification.read_at,
      ...item.notification,
      user: item.user
    }));
    yield put(getAlertsSuccess({ alerts, pagination: response.pagination }));
  } catch (error) {
    yield put(getAlertsFail(error.message || 'Failed to fetch alerts'));
  }
}

function* markAlertReadSaga(action) {
  try {
    const id = action.payload;
    // Use the backend endpoint for marking as read (POST for alerts)
    yield call(axios.post, `https://smileie.jantrah.com/backend/api/notifications/read?id=${id}`);
    yield put(markAlertReadSuccess(id));
  } catch (error) {
    yield put(markAlertReadFail(error.message || 'Failed to mark alert as read'));
  }
}

export default function* alertsSaga() {
  yield takeLatest(GET_ALERTS, fetchAlerts);
  yield takeLatest(MARK_ALERT_READ, markAlertReadSaga);
} 