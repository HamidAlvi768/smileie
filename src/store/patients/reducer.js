import { GET_PATIENTS_SUCCESS, API_FAIL, ADD_PATIENT_SUCCESS } from "./actionTypes";

const INIT_STATE = {
  patients: [],
  error: null,
};

const patientsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PATIENTS_SUCCESS:
      return { ...state, patients: action.payload.data };
    case ADD_PATIENT_SUCCESS:
      return { ...state, patients: [...state.patients, action.payload] };
    case API_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default patientsReducer; 