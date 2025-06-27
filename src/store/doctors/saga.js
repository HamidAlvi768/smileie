import { call, put, takeEvery } from "redux-saga/effects";
import { getDoctorsAPI, addDoctorAPI } from "../../helpers/api_helper";
import {
  GET_DOCTORS,
  ADD_DOCTOR
} from "./actionTypes";
import {
  getDoctorsSuccess,
  addDoctorSuccess,
  addDoctorMessage,
  apiFail,
  getDoctors
} from "./actions";

function* fetchDoctors() {
  try {
    const response = yield call(getDoctorsAPI);
    console.log('Doctors API response:', response);
    yield put(getDoctorsSuccess(response));
  } catch (error) {
    yield put(apiFail(error));
  }
}

function* addDoctorSaga({ payload }) {
  try {
    const response = yield call(addDoctorAPI, payload);
    console.log('Add doctor API response:', response);
    
    // Check if the response indicates success
    if (response.status === "success" || response.id) {
      yield put(addDoctorSuccess(response));
      yield put(addDoctorMessage(response.message || "Doctor created successfully!"));
      yield put(getDoctors()); // Refresh the doctors list
    } else {
      // Handle case where API returns success: false or error status
      const errorMessage = response.message || "Failed to create doctor";
      yield put(apiFail(errorMessage));
    }
  } catch (error) {
    console.error('Add doctor error:', error);
    yield put(apiFail(error));
  }
}

function* doctorSaga() {
  yield takeEvery(GET_DOCTORS, fetchDoctors);
  yield takeEvery(ADD_DOCTOR, addDoctorSaga);
}

export default doctorSaga;
