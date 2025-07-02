import { call, put, takeEvery } from "redux-saga/effects";
import { GET_PLANS, ADD_PLAN, DELETE_PLAN, UPDATE_PLAN } from "./actionTypes";
import { getPlansSuccess, getPlansFail, addPlanSuccess, addPlanFail, deletePlanSuccess, deletePlanFail, updatePlanSuccess, updatePlanFail, getPlans, addPlanMessage } from "./actions";
import { getPlansAPI, addPlanAPI, deletePlanAPI, updatePlanAPI } from "../../helpers/api_helper";

function* fetchPlans() {
  try {
    const response = yield call(getPlansAPI);
    yield put(getPlansSuccess(response));
  } catch (error) {
    yield put(getPlansFail(error));
  }
}

function* addPlanSaga({ payload }) {
  try {
    const response = yield call(addPlanAPI, payload);
    if (response.status === "error") {
      yield put(addPlanFail(response.message || "Failed to add plan"));
      return;
    }
    yield put(addPlanSuccess(response));
    yield put(addPlanMessage(response.message || "Plan added successfully!"));
    yield put(getPlans());
  } catch (error) {
    yield put(addPlanFail(error));
  }
}

function* deletePlanSaga({ payload }) {
  try {
    yield call(deletePlanAPI, payload);
    yield put(deletePlanSuccess(payload));
  } catch (error) {
    yield put(deletePlanFail(error));
  }
}

function* updatePlanSaga({ payload }) {
  try {
    const response = yield call(updatePlanAPI, payload);
    if (response.status === "error") {
      yield put(addPlanFail(response.message || "Failed to update plan"));
      return;
    }
    yield put(updatePlanSuccess(response.data ? response.data : payload));
    yield put(addPlanMessage(response.message || "Plan updated successfully!"));
  } catch (error) {
    yield put(addPlanFail(error));
  }
}

function* plansSaga() {
  yield takeEvery(GET_PLANS, fetchPlans);
  yield takeEvery(ADD_PLAN, addPlanSaga);
  yield takeEvery(DELETE_PLAN, deletePlanSaga);
  yield takeEvery(UPDATE_PLAN, updatePlanSaga);
}

export default plansSaga; 