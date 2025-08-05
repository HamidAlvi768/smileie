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

const initialState = {
  referrals: [],
  loading: false,
  error: null,
  updatingStatus: false,
  updateStatusError: null,
  updateStatusSuccess: null,
  referralAmount: null,
  amountLoading: false,
  amountError: null,
  payingReferrals: false,
  payError: null,
  paySuccess: null,
};

const referralsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REFERRALS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_REFERRALS_SUCCESS:
      return {
        ...state,
        loading: false,
        referrals: action.payload,
        error: null,
      };

    case GET_REFERRALS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_REFERRAL_STATUS:
      return {
        ...state,
        updatingStatus: true,
        updateStatusError: null,
        updateStatusSuccess: null,
      };

    case UPDATE_REFERRAL_STATUS_SUCCESS:
      return {
        ...state,
        updatingStatus: false,
        updateStatusSuccess: action.payload,
        updateStatusError: null,
      };

    case UPDATE_REFERRAL_STATUS_FAIL:
      return {
        ...state,
        updatingStatus: false,
        updateStatusError: action.payload,
        updateStatusSuccess: null,
      };

    case CLEAR_REFERRAL_STATUS_MESSAGES:
      return {
        ...state,
        updateStatusError: null,
        updateStatusSuccess: null,
      };

    case GET_REFERRAL_AMOUNT:
      return {
        ...state,
        amountLoading: true,
        amountError: null,
      };

    case GET_REFERRAL_AMOUNT_SUCCESS:
      return {
        ...state,
        amountLoading: false,
        referralAmount: action.payload,
        amountError: null,
      };

    case GET_REFERRAL_AMOUNT_FAIL:
      return {
        ...state,
        amountLoading: false,
        amountError: action.payload,
      };

    case PAY_REFERRALS:
      return {
        ...state,
        payingReferrals: true,
        payError: null,
        paySuccess: null,
      };

    case PAY_REFERRALS_SUCCESS:
      return {
        ...state,
        payingReferrals: false,
        paySuccess: action.payload,
        payError: null,
      };

    case PAY_REFERRALS_FAIL:
      return {
        ...state,
        payingReferrals: false,
        payError: action.payload,
        paySuccess: null,
      };

    default:
      return state;
  }
};

export default referralsReducer; 