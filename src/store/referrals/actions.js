import {
  GET_REFERRALS,
  GET_REFERRALS_SUCCESS,
  GET_REFERRALS_FAIL,
  UPDATE_REFERRAL_STATUS,
  UPDATE_REFERRAL_STATUS_SUCCESS,
  UPDATE_REFERRAL_STATUS_FAIL,
  CLEAR_REFERRAL_STATUS_MESSAGES,
  GET_REFERRAL_AMOUNT,
  GET_REFERRAL_AMOUNT_SUCCESS,
  GET_REFERRAL_AMOUNT_FAIL,
  PAY_REFERRALS,
  PAY_REFERRALS_SUCCESS,
  PAY_REFERRALS_FAIL,
} from './actionTypes';

export const getReferrals = (patientId) => ({
  type: GET_REFERRALS,
  payload: patientId,
});

export const getReferralsSuccess = (data) => ({
  type: GET_REFERRALS_SUCCESS,
  payload: data,
});

export const getReferralsFail = (error) => ({
  type: GET_REFERRALS_FAIL,
  payload: error,
});

export const updateReferralStatus = (referralId, status) => ({
  type: UPDATE_REFERRAL_STATUS,
  payload: { referralId, status },
});

export const updateReferralStatusSuccess = (data) => ({
  type: UPDATE_REFERRAL_STATUS_SUCCESS,
  payload: data,
});

export const updateReferralStatusFail = (error) => ({
  type: UPDATE_REFERRAL_STATUS_FAIL,
  payload: error,
});

export const clearReferralStatusMessages = () => ({
  type: CLEAR_REFERRAL_STATUS_MESSAGES,
});

export const getReferralAmount = (patientId) => ({
  type: GET_REFERRAL_AMOUNT,
  payload: patientId,
});

export const getReferralAmountSuccess = (data) => ({
  type: GET_REFERRAL_AMOUNT_SUCCESS,
  payload: data,
});

export const getReferralAmountFail = (error) => ({
  type: GET_REFERRAL_AMOUNT_FAIL,
  payload: error,
});

export const payReferrals = (patientId) => ({
  type: PAY_REFERRALS,
  payload: patientId,
});

export const payReferralsSuccess = (data) => ({
  type: PAY_REFERRALS_SUCCESS,
  payload: data,
});

export const payReferralsFail = (error) => ({
  type: PAY_REFERRALS_FAIL,
  payload: error,
}); 