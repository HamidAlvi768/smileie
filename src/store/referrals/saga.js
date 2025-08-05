import { call, put, takeEvery } from 'redux-saga/effects';
import {
  GET_REFERRALS,
  GET_REFERRALS_SUCCESS,
  GET_REFERRALS_FAIL,
  UPDATE_REFERRAL_STATUS,
  UPDATE_REFERRAL_STATUS_SUCCESS,
  UPDATE_REFERRAL_STATUS_FAIL,
  GET_REFERRAL_AMOUNT,
  GET_REFERRAL_AMOUNT_SUCCESS,
  GET_REFERRAL_AMOUNT_FAIL,
  PAY_REFERRALS,
  PAY_REFERRALS_SUCCESS,
  PAY_REFERRALS_FAIL,
} from './actionTypes';
import { 
  getReferralsAPI, 
  updateReferralStatusAPI, 
  getReferralAmountAPI, 
  payReferralsAPI 
} from '../../helpers/api_helper';

function* fetchReferrals({ payload: patientId }) {
  try {
    const response = yield call(getReferralsAPI, patientId);
    if (response.status === 'success') {
      yield put({ type: GET_REFERRALS_SUCCESS, payload: response.data });
    } else {
      yield put({ type: GET_REFERRALS_FAIL, payload: 'Failed to fetch referrals' });
    }
  } catch (error) {
    yield put({ type: GET_REFERRALS_FAIL, payload: error.message });
  }
}

function* updateReferralStatus({ payload: { referralId, status } }) {
  try {
    const response = yield call(updateReferralStatusAPI, referralId, status);
    if (response.status === 'success') {
      yield put({ type: UPDATE_REFERRAL_STATUS_SUCCESS, payload: response });
    } else {
      yield put({ type: UPDATE_REFERRAL_STATUS_FAIL, payload: 'Failed to update referral status' });
    }
  } catch (error) {
    yield put({ type: UPDATE_REFERRAL_STATUS_FAIL, payload: error.message });
  }
}

function* fetchReferralAmount({ payload: patientId }) {
  try {
    const response = yield call(getReferralAmountAPI, patientId);
    if (response.status === 'success') {
      yield put({ type: GET_REFERRAL_AMOUNT_SUCCESS, payload: response.data });
    } else {
      yield put({ type: GET_REFERRAL_AMOUNT_FAIL, payload: 'Failed to fetch referral amount' });
    }
  } catch (error) {
    yield put({ type: GET_REFERRAL_AMOUNT_FAIL, payload: error.message });
  }
}

function* payReferrals({ payload: patientId }) {
  try {
    const response = yield call(payReferralsAPI, patientId);
    if (response.status === 'success') {
      yield put({ type: PAY_REFERRALS_SUCCESS, payload: response });
    } else {
      yield put({ type: PAY_REFERRALS_FAIL, payload: response.message || 'Failed to pay referrals' });
    }
  } catch (error) {
    yield put({ type: PAY_REFERRALS_FAIL, payload: error.message });
  }
}

function* referralsSaga() {
  yield takeEvery(GET_REFERRALS, fetchReferrals);
  yield takeEvery(UPDATE_REFERRAL_STATUS, updateReferralStatus);
  yield takeEvery(GET_REFERRAL_AMOUNT, fetchReferralAmount);
  yield takeEvery(PAY_REFERRALS, payReferrals);
}

export default referralsSaga; 