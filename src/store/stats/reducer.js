import { GET_STATS, GET_STATS_SUCCESS, GET_STATS_FAIL } from "./actionTypes";

const INIT_STATE = {
  stats: {},
  loading: false,
  error: null,
};

const statsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_STATS:
      return { ...state, loading: true, error: null };
    case GET_STATS_SUCCESS:
      return { ...state, stats: action.payload.data, loading: false, error: null };
    case GET_STATS_FAIL:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default statsReducer; 