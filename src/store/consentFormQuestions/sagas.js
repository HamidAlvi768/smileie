import { call, put, takeLatest } from "redux-saga/effects";
import { createConsentFormQuestionsAPI, getConsentFormQuestionsAPI } from "../../helpers/api_helper";
import {
  CREATE_CONSENT_FORM_QUESTIONS,
  createConsentFormQuestionsSuccess,
  createConsentFormQuestionsFail,
  GET_CONSENT_FORM_QUESTIONS,
  getConsentFormQuestionsSuccess,
  getConsentFormQuestionsFail,
} from "./actions";

function* createConsentFormQuestions({ payload: questions }) {
  try {
    console.log('🔄 Creating consent form questions:', questions);
    const response = yield call(createConsentFormQuestionsAPI, questions);
    console.log('✅ Consent form questions API response:', response);
    
    // Handle the response format: { status: "success", message: "..." }
    if (response && response.status === "success") {
      yield put(createConsentFormQuestionsSuccess(response));
    } else if (response && response.status === "error") {
      yield put(createConsentFormQuestionsFail(response.message || "Failed to create consent form questions"));
    } else {
      yield put(createConsentFormQuestionsSuccess(response));
    }
  } catch (error) {
    console.error('❌ Consent form questions API error:', error);
    yield put(createConsentFormQuestionsFail(error));
  }
}

function* getConsentFormQuestions() {
  try {
    console.log('🔄 Fetching consent form questions');
    const response = yield call(getConsentFormQuestionsAPI);
    console.log('✅ Get consent form questions API response:', response);
    
    // Handle the response format: { status: "success", code: 200, data: [...] }
    if (response && response.status === "success") {
      yield put(getConsentFormQuestionsSuccess(response));
    } else if (response && response.status === "error") {
      yield put(getConsentFormQuestionsFail(response.message || "Failed to fetch consent form questions"));
    } else {
      yield put(getConsentFormQuestionsSuccess(response));
    }
  } catch (error) {
    console.error('❌ Get consent form questions API error:', error);
    yield put(getConsentFormQuestionsFail(error));
  }
}

function* consentFormQuestionsSaga() {
  yield takeLatest(CREATE_CONSENT_FORM_QUESTIONS, createConsentFormQuestions);
  yield takeLatest(GET_CONSENT_FORM_QUESTIONS, getConsentFormQuestions);
}

export default consentFormQuestionsSaga;
