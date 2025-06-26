import { call, put, takeEvery } from "redux-saga/effects";
import { getPatientsAPI, addPatientAPI } from "../../helpers/api_helper";
import { GET_PATIENTS, ADD_PATIENT } from "./actionTypes";
import { getPatientsSuccess, patientsApiFail, addPatientSuccess, getPatients } from "./actions";

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
    const response = yield call(addPatientAPI, payload);
    yield put(addPatientSuccess(response));
    yield put(getPatients());
  } catch (error) {
    yield put(patientsApiFail(error));
  }
}

function* patientsSaga() {
  yield takeEvery(GET_PATIENTS, fetchPatients);
  yield takeEvery(ADD_PATIENT, addPatientSaga);
}

export default patientsSaga; 