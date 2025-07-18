import { GET_PATIENTS, GET_PATIENTS_SUCCESS, API_FAIL, ADD_PATIENT_SUCCESS, ADD_PATIENT_MESSAGE, GET_RECENT_PATIENTS_SUCCESS, GET_PATIENT_DETAIL_SUCCESS, GET_PATIENT_DETAIL, UPDATE_PATIENT_DETAIL, UPDATE_PATIENT_DETAIL_SUCCESS, UPDATE_PATIENT_DETAIL_FAIL, GET_MONITORED_PATIENTS_SUCCESS, GET_NOT_MONITORED_PATIENTS_SUCCESS, GET_CONSENT_FORMS, GET_CONSENT_FORMS_SUCCESS, GET_CONSENT_FORMS_FAIL, CREATE_3D_PLAN, CREATE_3D_PLAN_SUCCESS, CREATE_3D_PLAN_FAIL, GET_3D_PLAN, GET_3D_PLAN_SUCCESS, GET_3D_PLAN_FAIL, UPDATE_3D_PLAN, UPDATE_3D_PLAN_SUCCESS, UPDATE_3D_PLAN_FAIL, DELETE_3D_PLAN, DELETE_3D_PLAN_SUCCESS, DELETE_3D_PLAN_FAIL, GET_TREATMENT_STEPS, GET_TREATMENT_STEPS_SUCCESS, GET_TREATMENT_STEPS_FAIL, GET_SCAN_DETAIL, GET_SCAN_DETAIL_SUCCESS, GET_SCAN_DETAIL_FAIL } from "./actionTypes";

const INIT_STATE = {
  patients: [],
  loading: false,
  monitoredPatients: [],
  notMonitoredPatients: [],
  error: null,
  successMessage: null,
  recentPatients: [],
  patientDetail: null,
  loadingDetail: false,
  updatingDetail: false,
  updateDetailError: null,
  consentForms: [],
  consentFormsLoading: false,
  consentFormsError: null,
  // 3D Plans state
  threeDPlan: null,
  threeDPlanLoading: false,
  threeDPlanError: null,
  creating3DPlan: false,
  updating3DPlan: false,
  deleting3DPlan: false,
  treatmentSteps: [],
  treatmentStepsLoading: false,
  treatmentStepsError: null,
  scanDetail: [],
  scanDetailLoading: false,
  scanDetailError: null,
  changingAligner: false,
  changeAlignerError: null,
  changeAlignerResult: null,
};

const patientsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PATIENTS:
      return { ...state, loading: true, error: null };
    case GET_PATIENTS_SUCCESS:
      return { ...state, patients: action.payload.data, loading: false, error: null };
    case ADD_PATIENT_SUCCESS:
      return { ...state, patients: [...state.patients, action.payload], error: null };
    case ADD_PATIENT_MESSAGE:
      return { ...state, successMessage: action.payload, error: null };
    case API_FAIL:
      return { ...state, error: action.payload, loading: false, successMessage: null };
    case GET_RECENT_PATIENTS_SUCCESS:
      return { ...state, recentPatients: action.payload.data };
    case GET_PATIENT_DETAIL:
      return { ...state, loadingDetail: true, error: null };
    case GET_PATIENT_DETAIL_SUCCESS:
      return { ...state, patientDetail: action.payload.data, loadingDetail: false, error: null };
    case UPDATE_PATIENT_DETAIL:
      return { ...state, updatingDetail: true, updateDetailError: null };
    case UPDATE_PATIENT_DETAIL_SUCCESS:
      return { ...state, patientDetail: action.payload.data, updatingDetail: false, updateDetailError: null };
    case UPDATE_PATIENT_DETAIL_FAIL:
      return { ...state, updatingDetail: false, updateDetailError: action.payload };
    case GET_MONITORED_PATIENTS_SUCCESS:
      return { ...state, monitoredPatients: action.payload.data, error: null };
    case GET_NOT_MONITORED_PATIENTS_SUCCESS:
      return { ...state, notMonitoredPatients: action.payload.data, error: null };
    case GET_CONSENT_FORMS:
      return { ...state, consentFormsLoading: true, consentFormsError: null };
    case GET_CONSENT_FORMS_SUCCESS:
      return { ...state, consentForms: Array.isArray(action.payload) ? action.payload : [], consentFormsLoading: false };
    case GET_CONSENT_FORMS_FAIL:
      return { ...state, consentFormsLoading: false, consentFormsError: action.payload, consentForms: [] };
    
    // 3D Plans cases
    case CREATE_3D_PLAN:
      return { ...state, creating3DPlan: true, threeDPlanError: null };
    case CREATE_3D_PLAN_SUCCESS:
      return { ...state, threeDPlan: action.payload.data, creating3DPlan: false, threeDPlanError: null };
    case CREATE_3D_PLAN_FAIL:
      return { ...state, creating3DPlan: false, threeDPlanError: action.payload };
    
    case GET_3D_PLAN:
      return { ...state, threeDPlanLoading: true, threeDPlanError: null };
    case GET_3D_PLAN_SUCCESS:
      return { ...state, threeDPlan: action.payload.data, threeDPlanLoading: false, threeDPlanError: null };
    case GET_3D_PLAN_FAIL:
      return { ...state, threeDPlanLoading: false, threeDPlanError: action.payload };
    
    case UPDATE_3D_PLAN:
      return { ...state, updating3DPlan: true, threeDPlanError: null };
    case UPDATE_3D_PLAN_SUCCESS:
      return { ...state, threeDPlan: action.payload.data, updating3DPlan: false, threeDPlanError: null };
    case UPDATE_3D_PLAN_FAIL:
      return { ...state, updating3DPlan: false, threeDPlanError: action.payload };
    
    case DELETE_3D_PLAN:
      return { ...state, deleting3DPlan: true, threeDPlanError: null };
    case DELETE_3D_PLAN_SUCCESS:
      return { ...state, threeDPlan: null, deleting3DPlan: false, threeDPlanError: null };
    case DELETE_3D_PLAN_FAIL:
      return { ...state, deleting3DPlan: false, threeDPlanError: action.payload };
    
    case GET_TREATMENT_STEPS:
      return { ...state, treatmentStepsLoading: true, treatmentStepsError: null };
    case GET_TREATMENT_STEPS_SUCCESS:
      return { ...state, treatmentSteps: action.payload.data, treatmentStepsLoading: false };
    case GET_TREATMENT_STEPS_FAIL:
      return { ...state, treatmentStepsLoading: false, treatmentStepsError: action.payload };
    
    case GET_SCAN_DETAIL:
      return { ...state, scanDetailLoading: true, scanDetailError: null };
    case GET_SCAN_DETAIL_SUCCESS:
      return { ...state, scanDetail: action.payload.data, scanDetailLoading: false };
    case GET_SCAN_DETAIL_FAIL:
      return { ...state, scanDetailError: action.payload, scanDetailLoading: false };
    
    case 'CHANGE_ALIGNER':
      return { ...state, changingAligner: true, changeAlignerError: null, changeAlignerResult: null };
    case 'CHANGE_ALIGNER_SUCCESS':
      return { ...state, changingAligner: false, changeAlignerResult: action.payload, changeAlignerError: null };
    case 'CHANGE_ALIGNER_FAIL':
      return { ...state, changingAligner: false, changeAlignerError: action.payload };
    
    case 'CLEAR_PATIENT_MESSAGES':
      return { ...state, successMessage: null, error: null };
    default:
      return state;
  }
};

export default patientsReducer;