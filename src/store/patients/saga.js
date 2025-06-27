import { call, put, takeEvery } from "redux-saga/effects";
import { getPatientsAPI, addPatientAPI, getRecentPatientsAPI } from "../../helpers/api_helper";
import { GET_PATIENTS, ADD_PATIENT, GET_RECENT_PATIENTS } from "./actionTypes";
import { getPatientsSuccess, patientsApiFail, addPatientSuccess, getPatients, getRecentPatientsSuccess } from "./actions";

function* fetchPatients() {
  try {
    const response = yield call(getPatientsAPI);
    yield put(getPatientsSuccess(response));
  } catch (error) {
    yield put(patientsApiFail(error));
  }
}

function* addPatientSaga({ payload }) {
  try {
    yield call(addPatientAPI, payload); // just call, no need to store response
    yield put(getPatients()); // 🔁 always fetch fresh data from DB
  } catch (error) {
    yield put(patientsApiFail(error));
  }
}


function* fetchRecentPatients() {
  try {
    const response = yield call(getRecentPatientsAPI);
    yield put(getRecentPatientsSuccess(response));
  } catch (error) {
    yield put(patientsApiFail(error));
  }
}

function* patientsSaga() {
  yield takeEvery(GET_PATIENTS, fetchPatients);
  yield takeEvery(ADD_PATIENT, addPatientSaga);
  yield takeEvery(GET_RECENT_PATIENTS, fetchRecentPatients);
}

export default patientsSaga; 