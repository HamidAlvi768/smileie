import { GET_PATIENTS_SUCCESS, API_FAIL, ADD_PATIENT_SUCCESS, ADD_PATIENT_MESSAGE, GET_RECENT_PATIENTS_SUCCESS, GET_PATIENT_DETAIL_SUCCESS, GET_PATIENT_DETAIL, UPDATE_PATIENT_DETAIL, UPDATE_PATIENT_DETAIL_SUCCESS, UPDATE_PATIENT_DETAIL_FAIL, GET_MONITORED_PATIENTS_SUCCESS, GET_NOT_MONITORED_PATIENTS_SUCCESS, GET_CONSENT_FORMS, GET_CONSENT_FORMS_SUCCESS, GET_CONSENT_FORMS_FAIL, CREATE_3D_PLAN, CREATE_3D_PLAN_SUCCESS, CREATE_3D_PLAN_FAIL, GET_3D_PLAN, GET_3D_PLAN_SUCCESS, GET_3D_PLAN_FAIL, UPDATE_3D_PLAN, UPDATE_3D_PLAN_SUCCESS, UPDATE_3D_PLAN_FAIL, DELETE_3D_PLAN, DELETE_3D_PLAN_SUCCESS, DELETE_3D_PLAN_FAIL } from "./actionTypes";

const INIT_STATE = {
  patients: [],
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
};

const patientsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PATIENTS_SUCCESS:
      return { ...state, patients: action.payload.data, error: null };
    case ADD_PATIENT_SUCCESS:
      return { ...state, patients: [...state.patients, action.payload], error: null };
    case ADD_PATIENT_MESSAGE:
      return { ...state, successMessage: action.payload, error: null };
    case API_FAIL:
      return { ...state, error: action.payload, successMessage: null };
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
    
    case 'CLEAR_PATIENT_MESSAGES':
      return { ...state, successMessage: null, error: null };
    default:
      return state;
  }
};

export default patientsReducer; 