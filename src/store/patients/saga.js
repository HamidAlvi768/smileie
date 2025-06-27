import { call, put, takeEvery } from "redux-saga/effects";
import { getPatientsAPI, addPatientAPI, getRecentPatientsAPI } from "../../helpers/api_helper";
import { GET_PATIENTS, ADD_PATIENT, GET_RECENT_PATIENTS } from "./actionTypes";
import { getPatientsSuccess, patientsApiFail, addPatientSuccess, addPatientMessage, getPatients, getRecentPatientsSuccess } from "./actions";

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
    // If backend returns status: "error" in a 200 response, treat as error
    if (response.status === "error") {
      throw response.message || "Failed to create patient";
    }
    yield put(addPatientSuccess(response));
    yield put(addPatientMessage(response.message || "Patient created successfully!"));
    yield put(getPatients()); // Refresh the patients list
  } catch (error) {
    console.error('Add patient error:', error);
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