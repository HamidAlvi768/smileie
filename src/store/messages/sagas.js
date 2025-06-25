import { call, put, takeLatest } from "redux-saga/effects";
import {
  FETCH_MESSAGES,
  fetchMessagesSuccess,
  fetchMessagesError,
  SEND_MESSAGE,
  sendMessageSuccess,
  sendMessageError,
} from "./actions";
import { getMessagesAPI, sendMessageAPI } from "../../helpers/api_helper";

function* fetchMessagesSaga(action) {
  try {
    const { patientId } = action.payload;
    const messages = yield call(getMessagesAPI, patientId);
    yield put(fetchMessagesSuccess(messages));
  } catch (error) {
    yield put(fetchMessagesError(error.message || "Failed to fetch messages"));
  }
}

function* sendMessageSaga(action) {
  try {
    const { patientId, message, file } = action.payload;
    const response = yield call(sendMessageAPI, patientId, message, file);
    yield put(sendMessageSuccess(response.data));
  } catch (error) {
    yield put(sendMessageError(error.message || "Failed to send message"));
  }
}

export default function* messagesSaga() {
  yield takeLatest(FETCH_MESSAGES, fetchMessagesSaga);
  yield takeLatest(SEND_MESSAGE, sendMessageSaga);
} 