import { GET_PLANS_SUCCESS, GET_PLANS_FAIL, ADD_PLAN_SUCCESS, DELETE_PLAN_SUCCESS, UPDATE_PLAN_SUCCESS, ADD_PLAN_MESSAGE, ADD_PLAN_FAIL, CLEAR_PLAN_MESSAGES } from "./actionTypes";

const INIT_STATE = {
  plans: [],
  error: null,
  successMessage: null,
};

const plansReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PLANS_SUCCESS:
      return { ...state, plans: action.payload.data, error: null };
    case GET_PLANS_FAIL:
      return { ...state, error: action.payload };
    case ADD_PLAN_SUCCESS:
      return { ...state, plans: [...state.plans, action.payload], error: null };
    case ADD_PLAN_MESSAGE:
      return { ...state, successMessage: action.payload, error: null };
    case ADD_PLAN_FAIL:
      return { ...state, error: action.payload, successMessage: null };
    case CLEAR_PLAN_MESSAGES:
      return { ...state, successMessage: null, error: null };
    case DELETE_PLAN_SUCCESS:
      return { ...state, plans: state.plans.filter((p) => p.id !== action.payload) };
    case UPDATE_PLAN_SUCCESS:
      return { ...state, plans: state.plans.map((p) => p.id === action.payload.id ? action.payload : p) };
    default:
      return state;
  }
};

export default plansReducer; 