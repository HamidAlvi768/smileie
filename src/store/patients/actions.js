import { GET_PATIENTS, GET_PATIENTS_SUCCESS, API_FAIL, ADD_PATIENT, ADD_PATIENT_SUCCESS } from "./actionTypes";

export const getPatients = () => ({ type: GET_PATIENTS });
export const getPatientsSuccess = (patients) => ({ type: GET_PATIENTS_SUCCESS, payload: patients });
export const patientsApiFail = (error) => ({ type: API_FAIL, payload: error });
export const addPatient = (patient) => ({ type: ADD_PATIENT, payload: patient });
export const addPatientSuccess = (patient) => ({ type: ADD_PATIENT_SUCCESS, payload: patient }); 