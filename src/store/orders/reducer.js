import {
  GET_ORDERS,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAIL,
  ADD_ORDER,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAIL,
  ADD_ORDER_MESSAGE,
  CLEAR_ORDER_MESSAGES,
} from "./actionTypes";

const INIT_STATE = {
  orders: [],
  loading: false,
  error: null,
  successMessage: null,
  adding: false,
  addError: null,
};

const ordersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ORDERS:
      return { ...state, loading: true, error: null };
    case GET_ORDERS_SUCCESS:
      return { 
        ...state, 
        orders: action.payload.data || [], 
        loading: false, 
        error: null 
      };
    case GET_ORDERS_FAIL:
      return { ...state, loading: false, error: action.payload };
    
    case ADD_ORDER:
      return { ...state, adding: true, addError: null };
    case ADD_ORDER_SUCCESS:
      return { 
        ...state, 
        orders: [...state.orders, action.payload], 
        adding: false, 
        addError: null 
      };
    case ADD_ORDER_FAIL:
      return { ...state, adding: false, addError: action.payload };
    case ADD_ORDER_MESSAGE:
      return { ...state, successMessage: action.payload, error: null };
    case CLEAR_ORDER_MESSAGES:
      return { ...state, successMessage: null, error: null, addError: null };
    
    default:
      return state;
  }
};

export default ordersReducer; 