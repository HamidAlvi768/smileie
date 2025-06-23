import { GET_PLANS_SUCCESS, GET_PLANS_FAIL } from "./actionTypes";

const INIT_STATE = {
  plans: [],
  error: null,
};

const plansReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PLANS_SUCCESS:
      return { ...state, plans: action.payload.data };
    case GET_PLANS_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default plansReducer; 