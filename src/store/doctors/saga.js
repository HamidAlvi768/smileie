import { call, put, takeEvery } from "redux-saga/effects";
import { getDoctorsAPI, addDoctorAPI } from "../../helpers/api_helper";
import {
  GET_DOCTORS,
  ADD_DOCTOR
} from "./actionTypes";
import {
  getDoctorsSuccess,
  addDoctorSuccess,
  apiFail
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
    yield put(addDoctorSuccess(response));
  } catch (error) {
    yield put(apiFail(error));
  }
}

function* doctorSaga() {
  yield takeEvery(GET_DOCTORS, fetchDoctors);
  yield takeEvery(ADD_DOCTOR, addDoctorSaga);
}

export default doctorSaga;
