import { GET_ALERTS, GET_ALERTS_SUCCESS, GET_ALERTS_FAIL } from '../notifications/actionTypes';
import { MARK_ALERT_READ, MARK_ALERT_READ_SUCCESS, MARK_ALERT_READ_FAIL } from '../notifications/actionTypes';

export const getAlerts = (userId, params = {}) => ({ type: GET_ALERTS, payload: { userId, params } });
export const getAlertsSuccess = (data) => ({ type: GET_ALERTS_SUCCESS, payload: data });
export const getAlertsFail = (error) => ({ type: GET_ALERTS_FAIL, payload: error });

export const markAlertRead = (id) => ({ type: MARK_ALERT_READ, payload: id });
export const markAlertReadSuccess = (id) => ({ type: MARK_ALERT_READ_SUCCESS, payload: id });
export const markAlertReadFail = (error) => ({ type: MARK_ALERT_READ_FAIL, payload: error }); 