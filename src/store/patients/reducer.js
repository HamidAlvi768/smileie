import { GET_PATIENTS_SUCCESS, API_FAIL, ADD_PATIENT_SUCCESS, ADD_PATIENT_MESSAGE, GET_RECENT_PATIENTS_SUCCESS } from "./actionTypes";

const INIT_STATE = {
  patients: [],
  error: null,
  successMessage: null,
  recentPatients: [],
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
    default:
      return state;
  }
};

export default patientsReducer; 