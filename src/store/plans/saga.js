import { call, put, takeEvery } from "redux-saga/effects";
import { GET_PLANS } from "./actionTypes";
import { getPlansSuccess, getPlansFail } from "./actions";
import { getPlansAPI } from "../../helpers/api_helper";

function* fetchPlans() {
  try {
    const response = yield call(getPlansAPI);
    yield put(getPlansSuccess(response));
  } catch (error) {
    yield put(getPlansFail(error));
  }
}

function* plansSaga() {
  yield takeEvery(GET_PLANS, fetchPlans);
}

export default plansSaga; 