import { call, put, takeEvery } from "redux-saga/effects";
import { addPatientAPI, getRecentPatientsAPI, getPatientDetailAPI, updatePatientDetailAPI, getMonitoredPatientsAPI, getNotMonitoredPatientsAPI, getConsentFormsAPI } from "../../helpers/api_helper";
import { ADD_PATIENT, GET_RECENT_PATIENTS, GET_PATIENT_DETAIL, UPDATE_PATIENT_DETAIL, GET_MONITORED_PATIENTS, GET_NOT_MONITORED_PATIENTS, GET_CONSENT_FORMS } from "./actionTypes";
import { addPatientSuccess, addPatientMessage, getPatients, getRecentPatientsSuccess, getPatientDetailSuccess, updatePatientDetailSuccess, updatePatientDetailFail, getPatientDetail, getMonitoredPatientsSuccess, getNotMonitoredPatientsSuccess, patientsApiFail, getConsentFormsSuccess, getConsentFormsFail } from "./actions";

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

function* fetchPatientDetail({ payload }) {
  try {
    const response = yield call(getPatientDetailAPI, payload);
    yield put(getPatientDetailSuccess(response));
  } catch (error) {
    yield put(patientsApiFail(error));
  }
}

function* updatePatientDetailSaga({ payload }) {
  try {
    const { id, data } = payload;
    const response = yield call(updatePatientDetailAPI, id, data);
    // If backend returns status: "error" in a 200 response, treat as error
    if (response.status === "error") {
      throw response.message || "Failed to update patient information";
    }
    yield put(updatePatientDetailSuccess(response));
    // Immediately re-fetch the latest patient detail
    yield put(getPatientDetail(id));
  } catch (error) {
    yield put(updatePatientDetailFail(error));
  }
}

function* fetchMonitoredPatients() {
  try {
    const response = yield call(getMonitoredPatientsAPI);
    yield put(getMonitoredPatientsSuccess(response));
  } catch (error) {
    yield put(patientsApiFail(error));
  }
}

function* fetchNotMonitoredPatients() {
  try {
    const response = yield call(getNotMonitoredPatientsAPI);
    yield put(getNotMonitoredPatientsSuccess(response));
  } catch (error) {
    yield put(patientsApiFail(error));
  }
}

function* fetchConsentForms(action) {
  try {
    const response = yield call(getConsentFormsAPI, action.payload);
    // Debug: log API response for consent forms
    console.log('ConsentForms API response:', response.data);
    yield put(getConsentFormsSuccess(response.data));
  } catch (error) {
    yield put(getConsentFormsFail(error));
  }
}

function* patientsSaga() {
  yield takeEvery(ADD_PATIENT, addPatientSaga);
  yield takeEvery(GET_RECENT_PATIENTS, fetchRecentPatients);
  yield takeEvery(GET_PATIENT_DETAIL, fetchPatientDetail);
  yield takeEvery(UPDATE_PATIENT_DETAIL, updatePatientDetailSaga);
  yield takeEvery(GET_MONITORED_PATIENTS, fetchMonitoredPatients);
  yield takeEvery(GET_NOT_MONITORED_PATIENTS, fetchNotMonitoredPatients);
  yield takeEvery(GET_CONSENT_FORMS, fetchConsentForms);
}

export default patientsSaga; 