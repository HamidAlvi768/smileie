import { GET_ALERTS, GET_ALERTS_SUCCESS, GET_ALERTS_FAIL, MARK_ALERT_READ_SUCCESS } from '../notifications/actionTypes';

const INIT_STATE = {
  alerts: [],
  loading: false,
  error: null,
};

const alertsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ALERTS:
      return { ...state, loading: true, error: null };
    case GET_ALERTS_SUCCESS:
      return { ...state, loading: false, alerts: action.payload, error: null };
    case GET_ALERTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case MARK_ALERT_READ_SUCCESS:
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.id === action.payload ? { ...alert, read_at: new Date().toISOString() } : alert
        ),
      };
    default:
      return state;
  }
};

export default alertsReducer; 