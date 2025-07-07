import {
  GET_FAQS, GET_FAQS_SUCCESS, GET_FAQS_FAIL,
  ADD_FAQ, ADD_FAQ_SUCCESS, ADD_FAQ_FAIL,
  UPDATE_FAQ, UPDATE_FAQ_SUCCESS, UPDATE_FAQ_FAIL,
  DELETE_FAQ, DELETE_FAQ_SUCCESS, DELETE_FAQ_FAIL
} from './actions';

const initialState = {
  faqs: [],
  loading: false,
  error: null,
  adding: false,
  addError: null,
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,
};

const faqsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FAQS:
      return { ...state, loading: true, error: null };
    case GET_FAQS_SUCCESS:
      return { ...state, loading: false, faqs: action.payload };
    case GET_FAQS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case ADD_FAQ:
      return { ...state, adding: true, addError: null };
    case ADD_FAQ_SUCCESS:
      return { ...state, adding: false };
    case ADD_FAQ_FAIL:
      return { ...state, adding: false, addError: action.payload };
    case UPDATE_FAQ:
      return { ...state, updating: true, updateError: null };
    case UPDATE_FAQ_SUCCESS:
      return {
        ...state,
        updating: false,
        faqs: state.faqs.map(f => f.id === action.payload.id ? action.payload : f)
      };
    case UPDATE_FAQ_FAIL:
      return { ...state, updating: false, updateError: action.payload };
    case DELETE_FAQ:
      return { ...state, deleting: true, deleteError: null };
    case DELETE_FAQ_SUCCESS:
      return {
        ...state,
        deleting: false,
        faqs: state.faqs.filter(f => f.id !== action.payload)
      };
    case DELETE_FAQ_FAIL:
      return { ...state, deleting: false, deleteError: action.payload };
    default:
      return state;
  }
};

export default faqsReducer; 