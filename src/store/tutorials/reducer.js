import {
  GET_TUTORIALS_SUCCESS,
  GET_TUTORIALS_FAIL,
  ADD_TUTORIAL_SUCCESS,
  ADD_TUTORIAL_FAIL,
  UPDATE_TUTORIAL_SUCCESS,
  UPDATE_TUTORIAL_FAIL,
  DELETE_TUTORIAL_SUCCESS,
  DELETE_TUTORIAL_FAIL
} from "./actionTypes";

const INIT_STATE = {
  tutorials: [],
  error: null,
};

const tutorialsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TUTORIALS_SUCCESS:
      return { ...state, tutorials: action.payload.data, error: null };
    case GET_TUTORIALS_FAIL:
      return { ...state, error: action.payload };
    case ADD_TUTORIAL_SUCCESS:
      return { ...state, tutorials: [...state.tutorials, action.payload], error: null };
    case ADD_TUTORIAL_FAIL:
      return { ...state, error: action.payload };
    case UPDATE_TUTORIAL_SUCCESS:
      return {
        ...state,
        tutorials: state.tutorials.map((t) => t.id === action.payload.id ? action.payload : t),
        error: null
      };
    case UPDATE_TUTORIAL_FAIL:
      return { ...state, error: action.payload };
    case DELETE_TUTORIAL_SUCCESS:
      return {
        ...state,
        tutorials: state.tutorials.filter((t) => t.id !== action.payload),
        error: null
      };
    case DELETE_TUTORIAL_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default tutorialsReducer; 