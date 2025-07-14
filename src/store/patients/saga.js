import { call, put, takeEvery } from "redux-saga/effects";
import { getPatientsAPI, addPatientAPI, getRecentPatientsAPI, getPatientDetailAPI, updatePatientDetailAPI, getMonitoredPatientsAPI, getNotMonitoredPatientsAPI, getConsentFormsAPI, create3DPlanAPI, get3DPlanAPI, update3DPlanAPI, delete3DPlanAPI } from "../../helpers/api_helper";
import { GET_PATIENTS, ADD_PATIENT, GET_RECENT_PATIENTS, GET_PATIENT_DETAIL, UPDATE_PATIENT_DETAIL, GET_MONITORED_PATIENTS, GET_NOT_MONITORED_PATIENTS, GET_CONSENT_FORMS, CREATE_3D_PLAN, GET_3D_PLAN, UPDATE_3D_PLAN, DELETE_3D_PLAN, GET_TREATMENT_STEPS } from "./actionTypes";
import { getPatientsSuccess, addPatientSuccess, addPatientMessage, getPatients, getRecentPatientsSuccess, getPatientDetailSuccess, updatePatientDetailSuccess, updatePatientDetailFail, getPatientDetail, getMonitoredPatientsSuccess, getNotMonitoredPatientsSuccess, patientsApiFail, getConsentFormsSuccess, getConsentFormsFail, create3DPlanSuccess, create3DPlanFail, get3DPlanSuccess, get3DPlanFail, update3DPlanSuccess, update3DPlanFail, delete3DPlanSuccess, delete3DPlanFail, get3DPlan, getTreatmentStepsSuccess, getTreatmentStepsFail } from "./actions";
import { getTreatmentStepsAPI } from "../../helpers/api_helper";

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

// 3D Plans Sagas
function* create3DPlanSaga({ payload }) {
  try {
    const response = yield call(create3DPlanAPI, payload);
    if (response.status === "error") {
      throw response.message || "Failed to create 3D plan";
    }
    yield put(create3DPlanSuccess(response));
    // Fetch the latest plan after creation
    if (payload.patient_id) {
      yield put(get3DPlan(payload.patient_id));
    }
  } catch (error) {
    console.error('Create 3D plan error:', error);
    yield put(create3DPlanFail(error));
  }
}

function* get3DPlanSaga({ payload }) {
  try {
    const response = yield call(get3DPlanAPI, payload);
    yield put(get3DPlanSuccess(response));
  } catch (error) {
    yield put(get3DPlanFail(error));
  }
}

function* update3DPlanSaga({ payload }) {
  try {
    const response = yield call(update3DPlanAPI, payload);
    if (response.status === "error") {
      throw response.message || "Failed to update 3D plan";
    }
    yield put(update3DPlanSuccess(response));
    // Fetch the latest plan after update
    if (payload.patient_id) {
      yield put(get3DPlan(payload.patient_id));
    }
  } catch (error) {
    yield put(update3DPlanFail(error));
  }
}

function* delete3DPlanSaga({ payload }) {
  try {
    const response = yield call(delete3DPlanAPI, payload);
    if (response.status === "error") {
      throw response.message || "Failed to delete 3D plan";
    }
    yield put(delete3DPlanSuccess(payload));
  } catch (error) {
    yield put(delete3DPlanFail(error));
  }
}

function* fetchTreatmentSteps({ payload }) {
  try {
    const response = yield call(getTreatmentStepsAPI, payload);
    yield put(getTreatmentStepsSuccess(response));
  } catch (error) {
    yield put(getTreatmentStepsFail(error));
  }
}

function* patientsSaga() {
  yield takeEvery(GET_PATIENTS, fetchPatients);
  yield takeEvery(ADD_PATIENT, addPatientSaga);
  yield takeEvery(GET_RECENT_PATIENTS, fetchRecentPatients);
  yield takeEvery(GET_PATIENT_DETAIL, fetchPatientDetail);
  yield takeEvery(UPDATE_PATIENT_DETAIL, updatePatientDetailSaga);
  yield takeEvery(GET_MONITORED_PATIENTS, fetchMonitoredPatients);
  yield takeEvery(GET_NOT_MONITORED_PATIENTS, fetchNotMonitoredPatients);
  yield takeEvery(GET_CONSENT_FORMS, fetchConsentForms);
  yield takeEvery(CREATE_3D_PLAN, create3DPlanSaga);
  yield takeEvery(GET_3D_PLAN, get3DPlanSaga);
  yield takeEvery(UPDATE_3D_PLAN, update3DPlanSaga);
  yield takeEvery(DELETE_3D_PLAN, delete3DPlanSaga);
  yield takeEvery(GET_TREATMENT_STEPS, fetchTreatmentSteps);
}

export default patientsSaga; 