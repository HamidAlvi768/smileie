import { GET_NOTIFICATIONS, GET_NOTIFICATIONS_SUCCESS, GET_NOTIFICATIONS_FAIL } from './actionTypes';

const INIT_STATE = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      return { ...state, loading: true, error: null };
    case GET_NOTIFICATIONS_SUCCESS:
      return { ...state, loading: false, notifications: action.payload, error: null };
    case GET_NOTIFICATIONS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default notificationsReducer; 