import { call, put, takeLatest, all } from 'redux-saga/effects';
import { getFaqsAPI, addFaqAPI, updateFaqAPI, deleteFaqAPI } from '../../helpers/api_helper';
import {
  GET_FAQS, getFaqsSuccess, getFaqsFail,
  ADD_FAQ, addFaqSuccess, addFaqFail,
  UPDATE_FAQ, updateFaqSuccess, updateFaqFail,
  DELETE_FAQ, deleteFaqSuccess, deleteFaqFail
} from './actions';
import { GET_FAQS as GET_FAQS_TYPE } from './actions';

function* fetchFaqs() {
  try {
    const data = yield call(getFaqsAPI);
    const faqs = Array.isArray(data) ? data : data.data || [];
    yield put(getFaqsSuccess(faqs));
  } catch (error) {
    yield put(getFaqsFail(error));
  }
}

function* createFaq(action) {
  try {
    const data = yield call(addFaqAPI, action.payload);
    const faq = data.data || data;
    yield put(addFaqSuccess(faq));
    yield put({ type: GET_FAQS_TYPE });
  } catch (error) {
    yield put(addFaqFail(error));
  }
}

function* updateFaqSaga(action) {
  try {
    const data = yield call(updateFaqAPI, action.payload);
    const faq = data.data || data;
    yield put(updateFaqSuccess(faq));
    yield put({ type: GET_FAQS_TYPE });
  } catch (error) {
    yield put(updateFaqFail(error));
  }
}

function* deleteFaqSaga(action) {
  try {
    yield call(deleteFaqAPI, action.payload);
    yield put(deleteFaqSuccess(action.payload));
    yield put({ type: GET_FAQS_TYPE });
  } catch (error) {
    yield put(deleteFaqFail(error));
  }
}

export default function* faqsSaga() {
  yield all([
    takeLatest(GET_FAQS, fetchFaqs),
    takeLatest(ADD_FAQ, createFaq),
    takeLatest(UPDATE_FAQ, updateFaqSaga),
    takeLatest(DELETE_FAQ, deleteFaqSaga),
  ]);
} 