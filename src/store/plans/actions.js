import {
  GET_PLANS,
  GET_PLANS_SUCCESS,
  GET_PLANS_FAIL
} from "./actionTypes";

export const getPlans = () => ({ type: GET_PLANS });
export const getPlansSuccess = (plans) => ({ type: GET_PLANS_SUCCESS, payload: plans });
export const getPlansFail = (error) => ({ type: GET_PLANS_FAIL, payload: error }); 