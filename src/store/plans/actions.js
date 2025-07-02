import {
  GET_PLANS,
  GET_PLANS_SUCCESS,
  GET_PLANS_FAIL,
  ADD_PLAN,
  ADD_PLAN_SUCCESS,
  ADD_PLAN_FAIL,
  DELETE_PLAN,
  DELETE_PLAN_SUCCESS,
  DELETE_PLAN_FAIL,
  UPDATE_PLAN,
  UPDATE_PLAN_SUCCESS,
  UPDATE_PLAN_FAIL
} from "./actionTypes";

export const getPlans = () => ({ type: GET_PLANS });
export const getPlansSuccess = (plans) => ({ type: GET_PLANS_SUCCESS, payload: plans });
export const getPlansFail = (error) => ({ type: GET_PLANS_FAIL, payload: error });

export const addPlan = (plan) => ({ type: ADD_PLAN, payload: plan });
export const addPlanSuccess = (plan) => ({ type: ADD_PLAN_SUCCESS, payload: plan });
export const addPlanFail = (error) => ({ type: ADD_PLAN_FAIL, payload: error });

export const deletePlan = (id) => ({ type: DELETE_PLAN, payload: id });
export const deletePlanSuccess = (id) => ({ type: DELETE_PLAN_SUCCESS, payload: id });
export const deletePlanFail = (error) => ({ type: DELETE_PLAN_FAIL, payload: error });

export const updatePlan = (plan) => ({ type: UPDATE_PLAN, payload: plan });
export const updatePlanSuccess = (plan) => ({ type: UPDATE_PLAN_SUCCESS, payload: plan });
export const updatePlanFail = (error) => ({ type: UPDATE_PLAN_FAIL, payload: error });

export const addPlanMessage = (message) => ({ type: "ADD_PLAN_MESSAGE", payload: message });
export const clearPlanMessages = () => ({ type: "CLEAR_PLAN_MESSAGES" }); 