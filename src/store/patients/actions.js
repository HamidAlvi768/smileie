import { GET_PATIENTS, GET_PATIENTS_SUCCESS, API_FAIL, ADD_PATIENT, ADD_PATIENT_SUCCESS, ADD_PATIENT_MESSAGE, GET_RECENT_PATIENTS, GET_RECENT_PATIENTS_SUCCESS, GET_PATIENT_DETAIL, GET_PATIENT_DETAIL_SUCCESS, UPDATE_PATIENT_DETAIL, UPDATE_PATIENT_DETAIL_SUCCESS, UPDATE_PATIENT_DETAIL_FAIL, GET_MONITORED_PATIENTS, GET_MONITORED_PATIENTS_SUCCESS, GET_NOT_MONITORED_PATIENTS, GET_NOT_MONITORED_PATIENTS_SUCCESS, GET_CONSENT_FORMS, GET_CONSENT_FORMS_SUCCESS, GET_CONSENT_FORMS_FAIL, CREATE_3D_PLAN, CREATE_3D_PLAN_SUCCESS, CREATE_3D_PLAN_FAIL, GET_3D_PLAN, GET_3D_PLAN_SUCCESS, GET_3D_PLAN_FAIL, UPDATE_3D_PLAN, UPDATE_3D_PLAN_SUCCESS, UPDATE_3D_PLAN_FAIL, DELETE_3D_PLAN, DELETE_3D_PLAN_SUCCESS, DELETE_3D_PLAN_FAIL, GET_TREATMENT_STEPS, GET_TREATMENT_STEPS_SUCCESS, GET_TREATMENT_STEPS_FAIL, GET_SCAN_DETAIL, GET_SCAN_DETAIL_SUCCESS, GET_SCAN_DETAIL_FAIL } from "./actionTypes";

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
export const updatePatientDetail = (id, data) => ({ type: UPDATE_PATIENT_DETAIL, payload: { id, data } });
export const updatePatientDetailSuccess = (patient) => ({ type: UPDATE_PATIENT_DETAIL_SUCCESS, payload: patient });
export const updatePatientDetailFail = (error) => ({ type: UPDATE_PATIENT_DETAIL_FAIL, payload: error });
export const clearPatientMessages = () => ({ type: 'CLEAR_PATIENT_MESSAGES' });
export const getMonitoredPatients = () => ({ type: GET_MONITORED_PATIENTS });
export const getMonitoredPatientsSuccess = (patients) => ({ type: GET_MONITORED_PATIENTS_SUCCESS, payload: patients });
export const getNotMonitoredPatients = () => ({ type: GET_NOT_MONITORED_PATIENTS });
export const getNotMonitoredPatientsSuccess = (patients) => ({ type: GET_NOT_MONITORED_PATIENTS_SUCCESS, payload: patients });
export const getConsentForms = (patientId) => ({ type: GET_CONSENT_FORMS, payload: patientId });
export const getConsentFormsSuccess = (data) => ({ type: GET_CONSENT_FORMS_SUCCESS, payload: data });
export const getConsentFormsFail = (error) => ({ type: GET_CONSENT_FORMS_FAIL, payload: error });

// 3D Plans Actions
export const create3DPlan = (planData) => ({ type: CREATE_3D_PLAN, payload: planData });
export const create3DPlanSuccess = (plan) => ({ type: CREATE_3D_PLAN_SUCCESS, payload: plan });
export const create3DPlanFail = (error) => ({ type: CREATE_3D_PLAN_FAIL, payload: error });

export const get3DPlan = (patientId) => ({ type: GET_3D_PLAN, payload: patientId });
export const get3DPlanSuccess = (plan) => ({ type: GET_3D_PLAN_SUCCESS, payload: plan });
export const get3DPlanFail = (error) => ({ type: GET_3D_PLAN_FAIL, payload: error });

export const update3DPlan = (planData) => ({ type: UPDATE_3D_PLAN, payload: planData });
export const update3DPlanSuccess = (plan) => ({ type: UPDATE_3D_PLAN_SUCCESS, payload: plan });
export const update3DPlanFail = (error) => ({ type: UPDATE_3D_PLAN_FAIL, payload: error });

export const delete3DPlan = (id) => ({ type: DELETE_3D_PLAN, payload: id });
export const delete3DPlanSuccess = (id) => ({ type: DELETE_3D_PLAN_SUCCESS, payload: id });
export const delete3DPlanFail = (error) => ({ type: DELETE_3D_PLAN_FAIL, payload: error });

export const getTreatmentSteps = (patientId) => ({ type: GET_TREATMENT_STEPS, payload: patientId });
export const getTreatmentStepsSuccess = (steps) => ({ type: GET_TREATMENT_STEPS_SUCCESS, payload: steps });
export const getTreatmentStepsFail = (error) => ({ type: GET_TREATMENT_STEPS_FAIL, payload: error });
export const getScanDetail = (id, step_number) => ({ type: GET_SCAN_DETAIL, payload: { id, step_number } });
export const getScanDetailSuccess = (data) => ({ type: GET_SCAN_DETAIL_SUCCESS, payload: data });
export const getScanDetailFail = (error) => ({ type: GET_SCAN_DETAIL_FAIL, payload: error });

// Change aligner actions
export const changeAligner = (data) => ({ type: 'CHANGE_ALIGNER', payload: data });
export const changeAlignerSuccess = (result) => ({ type: 'CHANGE_ALIGNER_SUCCESS', payload: result });
export const changeAlignerFail = (error) => ({ type: 'CHANGE_ALIGNER_FAIL', payload: error });