import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_ORDERS,
  ADD_ORDER,
} from "./actionTypes";
import {
  getOrders,
  getOrdersSuccess,
  getOrdersFail,
  addOrderSuccess,
  addOrderFail,
  addOrderMessage,
} from "./actions";
import {
  getOrdersAPI,
  addOrderAPI,
} from "../../helpers/api_helper";

function* fetchOrders({ payload }) {
  try {
    const response = yield call(getOrdersAPI, payload.patientId);
    yield put(getOrdersSuccess(response));
  } catch (error) {
    const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch orders';
    yield put(getOrdersFail(errorMessage));
  }
}

function* addOrderSaga({ payload }) {
  try {
    const response = yield call(addOrderAPI, payload);
    if (response.status === "success") {
      yield put(addOrderSuccess(response.data || response));
      yield put(addOrderMessage(response.message || "Order added successfully"));
      
      // Refresh the orders list to show latest data
      yield put(getOrders(payload.patient_id));
    } else {
      yield put(addOrderFail(response.message || "Failed to add order"));
    }
  } catch (error) {
    const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to add order';
    yield put(addOrderFail(errorMessage));
  }
}

function* ordersSaga() {
  yield takeEvery(GET_ORDERS, fetchOrders);
  yield takeEvery(ADD_ORDER, addOrderSaga);
}

export default ordersSaga; 