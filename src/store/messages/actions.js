// Action Types
export const FETCH_MESSAGES = "FETCH_MESSAGES";
export const FETCH_MESSAGES_SUCCESS = "FETCH_MESSAGES_SUCCESS";
export const FETCH_MESSAGES_ERROR = "FETCH_MESSAGES_ERROR";

export const SEND_MESSAGE = "SEND_MESSAGE";
export const SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
export const SEND_MESSAGE_ERROR = "SEND_MESSAGE_ERROR";

// Action Creators
export const fetchMessages = (patientId) => ({
  type: FETCH_MESSAGES,
  payload: { patientId },
});

export const fetchMessagesSuccess = (messages) => ({
  type: FETCH_MESSAGES_SUCCESS,
  payload: messages,
});

export const fetchMessagesError = (error) => ({
  type: FETCH_MESSAGES_ERROR,
  payload: error,
});

export const sendMessage = (patientId, message, file) => ({
  type: SEND_MESSAGE,
  payload: { patientId, message, file },
});

export const sendMessageSuccess = (message) => ({
  type: SEND_MESSAGE_SUCCESS,
  payload: message,
});

export const sendMessageError = (error) => ({
  type: SEND_MESSAGE_ERROR,
  payload: error,
}); 