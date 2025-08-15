import {
  CREATE_CONSENT_FORM_QUESTIONS,
  CREATE_CONSENT_FORM_QUESTIONS_SUCCESS,
  CREATE_CONSENT_FORM_QUESTIONS_FAIL,
  GET_CONSENT_FORM_QUESTIONS,
  GET_CONSENT_FORM_QUESTIONS_SUCCESS,
  GET_CONSENT_FORM_QUESTIONS_FAIL,
  CLEAR_CONSENT_FORM_QUESTIONS_STATE,
} from "./actions";

const initialState = {
  loading: false,
  error: null,
  success: false,
  message: null,
  questions: [],
};

const consentFormQuestions = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CONSENT_FORM_QUESTIONS:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
        message: null,
      };

    case CREATE_CONSENT_FORM_QUESTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message || "Questions saved successfully!",
        error: null,
      };

    case CREATE_CONSENT_FORM_QUESTIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
        message: null,
      };

    case GET_CONSENT_FORM_QUESTIONS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_CONSENT_FORM_QUESTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        questions: action.payload.data || [],
        error: null,
      };

    case GET_CONSENT_FORM_QUESTIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        questions: [],
      };

    case CLEAR_CONSENT_FORM_QUESTIONS_STATE:
      return {
        ...initialState,
        questions: state.questions, // Keep questions but clear other state
      };

    default:
      return state;
  }
};

export default consentFormQuestions;
