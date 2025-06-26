import { call, put, takeEvery } from "redux-saga/effects";
import { GET_PLANS, ADD_PLAN, DELETE_PLAN, UPDATE_PLAN } from "./actionTypes";
import { getPlansSuccess, getPlansFail, addPlanSuccess, addPlanFail, deletePlanSuccess, deletePlanFail, updatePlanSuccess, updatePlanFail, getPlans } from "./actions";
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
    yield put(addPlanSuccess(response));
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
    yield put(updatePlanSuccess(response.data ? response.data : payload));
  } catch (error) {
    yield put(updatePlanFail(error));
  }
}

function* plansSaga() {
  yield takeEvery(GET_PLANS, fetchPlans);
  yield takeEvery(ADD_PLAN, addPlanSaga);
  yield takeEvery(DELETE_PLAN, deletePlanSaga);
  yield takeEvery(UPDATE_PLAN, updatePlanSaga);
}

export default plansSaga; 