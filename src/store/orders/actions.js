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

export const getOrders = (patientId) => ({ 
  type: GET_ORDERS, 
  payload: { patientId } 
});

export const getOrdersSuccess = (orders) => ({
  type: GET_ORDERS_SUCCESS,
  payload: orders,
});

export const getOrdersFail = (error) => ({
  type: GET_ORDERS_FAIL,
  payload: error,
});

export const addOrder = (orderData) => ({
  type: ADD_ORDER,
  payload: orderData,
});

export const addOrderSuccess = (order) => ({
  type: ADD_ORDER_SUCCESS,
  payload: order,
});

export const addOrderFail = (error) => ({
  type: ADD_ORDER_FAIL,
  payload: error,
});

export const addOrderMessage = (message) => ({
  type: ADD_ORDER_MESSAGE,
  payload: message,
});

export const clearOrderMessages = () => ({
  type: CLEAR_ORDER_MESSAGES,
}); 