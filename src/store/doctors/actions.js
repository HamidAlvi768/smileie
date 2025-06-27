import {
  GET_DOCTORS,
  GET_DOCTORS_SUCCESS,
  ADD_DOCTOR,
  ADD_DOCTOR_SUCCESS,
  API_FAIL,
} from "./actionTypes";

export const getDoctors = () => ({ type: GET_DOCTORS });
export const getDoctorsSuccess = (doctors) => ({ type: GET_DOCTORS_SUCCESS, payload: doctors });

export const addDoctor = (doctor) => ({ type: ADD_DOCTOR, payload: doctor });
export const addDoctorSuccess = (doctor) => ({ type: ADD_DOCTOR_SUCCESS, payload: doctor });

export const apiFail = (error) => ({ type: API_FAIL, payload: error });
export const clearDoctorError = () => ({
  type: 'CLEAR_DOCTOR_ERROR'
});