// Layout
export * from "./layout/actions";

// Calendar
export * from "./calendar/actions"

// Authentication module
export * from "./auth/register/actions"
export * from "./auth/login/actions"
export * from "./auth/forgetpwd/actions"
export * from "./auth/profile/actions"
export * from "./doctors/actions";

// Plans module
export * from "./plans/actions";

// Stats module
export * from "./stats/actions";

// Patients module
export * from "./patients/actions";

// Orders module
export * from "./orders/actions";

export * from "./alerts/actions";

export const GET_FAQS = 'GET_FAQS';
export const GET_FAQS_SUCCESS = 'GET_FAQS_SUCCESS';
export const GET_FAQS_FAIL = 'GET_FAQS_FAIL';
export const ADD_FAQ = 'ADD_FAQ';
export const ADD_FAQ_SUCCESS = 'ADD_FAQ_SUCCESS';
export const ADD_FAQ_FAIL = 'ADD_FAQ_FAIL';