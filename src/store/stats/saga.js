import { call, put, takeEvery } from "redux-saga/effects";
import { GET_STATS } from "./actionTypes";
import { getStatsSuccess, getStatsFail } from "./actions";
import { getStatsAPI } from "../../helpers/api_helper";

function* fetchStats() {
  try {
    const response = yield call(getStatsAPI);
    yield put(getStatsSuccess(response));
  } catch (error) {
    yield put(getStatsFail(error));
  }
}

function* statsSaga() {
  yield takeEvery(GET_STATS, fetchStats);
}

export default statsSaga; 