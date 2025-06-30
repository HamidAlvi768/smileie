import { GET_PATIENTS, GET_PATIENTS_SUCCESS, API_FAIL, ADD_PATIENT, ADD_PATIENT_SUCCESS, ADD_PATIENT_MESSAGE, GET_RECENT_PATIENTS, GET_RECENT_PATIENTS_SUCCESS, GET_PATIENT_DETAIL, GET_PATIENT_DETAIL_SUCCESS } from "./actionTypes";

export const getPatients = () => ({ type: GET_PATIENTS });
export const getPatientsSuccess = (patients) => ({ type: GET_PATIENTS_SUCCESS, payload: patients });
export const patientsApiFail = (error) => ({ type: API_FAIL, payload: error });
export const addPatient = (patient) => ({ type: ADD_PATIENT, payload: patient });
export const addPatientSuccess = (patient) => ({ type: ADD_PATIENT_SUCCESS, payload: patient });
export const addPatientMessage = (message) => ({ type: ADD_PATIENT_MESSAGE, payload: message });
export const getRecentPatients = () => ({ type: GET_RECENT_PATIENTS });
export const getRecentPatientsSuccess = (patients) => ({ type: GET_RECENT_PATIENTS_SUCCESS, payload: patients });
export const getPatientDetail = (id) => ({ type: GET_PATIENT_DETAIL, payload: id });
export const getPatientDetailSuccess = (patient) => ({ type: GET_PATIENT_DETAIL_SUCCESS, payload: patient }); 