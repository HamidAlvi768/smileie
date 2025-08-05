import { call, put, takeEvery } from "redux-saga/effects";
import { GET_STATS } from "./actionTypes";
import { getStatsSuccess, getStatsFail } from "./actions";
import { getStatsAPI } from "../../helpers/api_helper";

function* fetchStats() {
  try {
    console.log('🔄 Stats API called - fetching dashboard data...');
    const response = yield call(getStatsAPI);
    console.log('✅ Stats API response received:', response);
    yield put(getStatsSuccess(response));
  } catch (error) {
    console.error('❌ Stats API error:', error);
    yield put(getStatsFail(error));
  }
}

function* statsSaga() {
  yield takeEvery(GET_STATS, fetchStats);
}

export default statsSaga; 