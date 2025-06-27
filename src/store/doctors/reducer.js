import {
  GET_DOCTORS_SUCCESS,
  ADD_DOCTOR_SUCCESS,
  ADD_DOCTOR_MESSAGE,
  API_FAIL
} from "./actionTypes";

const INIT_STATE = {
  doctors: [],
  error: null,
  successMessage: null,
};

const doctorReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DOCTORS_SUCCESS:
      return { ...state, doctors: action.payload.data, error: null };
    case ADD_DOCTOR_SUCCESS:
      return { ...state, doctors: [...state.doctors, action.payload], error: null };
    case ADD_DOCTOR_MESSAGE:
      return { ...state, successMessage: action.payload, error: null };
    case API_FAIL:
      return { ...state, error: action.payload, successMessage: null };
    case "CLEAR_DOCTOR_ERROR":
      return { ...state, error: null, successMessage: null };
    default:
      return state;
  }
};

export default doctorReducer;
