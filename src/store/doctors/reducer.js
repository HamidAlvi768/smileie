import {
  GET_DOCTORS_SUCCESS,
  ADD_DOCTOR_SUCCESS,
  API_FAIL
} from "./actionTypes";

const INIT_STATE = {
  doctors: [],
  error: null,
};

const doctorReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DOCTORS_SUCCESS:
      return { ...state, doctors: action.payload.data };
    case ADD_DOCTOR_SUCCESS:
      return { ...state, doctors: [...state.doctors, action.payload] };
    case API_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default doctorReducer;
