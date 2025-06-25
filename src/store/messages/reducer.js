import {
  FETCH_MESSAGES,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_ERROR,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
} from "./actions";

const initialState = {
  loading: false,
  error: null,
  messages: [],
  sending: false,
};

const messages = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MESSAGES:
      return { ...state, loading: true, error: null };
    case FETCH_MESSAGES_SUCCESS:
      return { ...state, loading: false, messages: action.payload.data || [], error: null };
    case FETCH_MESSAGES_ERROR:
      return { ...state, loading: false, error: action.payload };
    case SEND_MESSAGE:
      return { ...state, sending: true, error: null };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        sending: false,
        messages: [...state.messages, action.payload],
        error: null,
      };
    case SEND_MESSAGE_ERROR:
      return { ...state, sending: false, error: action.payload };
    default:
      return state;
  }
};

export default messages; 