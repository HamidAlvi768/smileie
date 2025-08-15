import { GET_NOTIFICATIONS, GET_NOTIFICATIONS_SUCCESS, GET_NOTIFICATIONS_FAIL, MARK_NOTIFICATION_READ_SUCCESS } from './actionTypes';

const INIT_STATE = {
  notifications: [],
  pagination: null,
  loading: false,
  error: null,
};

const notificationsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      return { ...state, loading: true, error: null };
    case GET_NOTIFICATIONS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        notifications: action.payload.notifications || action.payload, 
        pagination: action.payload.pagination || null,
        error: null 
      };
    case GET_NOTIFICATIONS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case MARK_NOTIFICATION_READ_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read_at: new Date().toISOString() } : n
        ),
      };
    case 'RECEIVE_NOTIFICATION_SSE': {
      const newNotif = action.payload;
      // Avoid duplicates by id
      const exists = state.notifications.some(n => n.id === newNotif.id);
      if (exists) return state;
      return {
        ...state,
        notifications: [newNotif, ...state.notifications],
      };
    }
    case 'SET_NOTIFICATION_COUNT':
      return {
        ...state,
        notificationCount: action.payload,
      };
    default:
      return state;
  }
};

export default notificationsReducer; 