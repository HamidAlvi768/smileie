//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register";

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/post-fake-profile";

//CALENDER
export const GET_EVENTS = "/events";
export const ADD_NEW_EVENT = "/add/event";
export const UPDATE_EVENT = "/update/event";
export const DELETE_EVENT = "/delete/event";
export const GET_CATEGORIES = "/categories";

//doctors
export const GET_DOCTOR_API = "/doctors";
export const ADD_DOCTOR_API = "/doctors/create";

//plans
export const GET_PLANS_API = "/plans";
export const ADD_PLAN_API = "/plans/create";
export const DELETE_PLAN_API = "/plans/delete";
export const UPDATE_PLAN_API = "/plans/update";

//stats
export const GET_STATS_API = "/dashboard/stats";

//chat
export const SEND_MESSAGE_API = "/chat/messages/send";

//generic-records (dropdown settings)
export const GET_GENERAL_TYPES_API = "/generic-records";
export const ADD_GENERAL_TYPE_API = "/generic-records/create";
export const UPDATE_GENERAL_TYPE_API = "/generic-records/update";
export const DELETE_GENERAL_TYPE_API = "/generic-records/delete";

//patients
export const GET_PATIENTS_API = `/patients?_=${Date.now()}`;
export const ADD_PATIENT_API = "/patients/create";
export const GET_RECENT_PATIENTS_API = "/patients/recent";

//tutorials
export const GET_TUTORIALS_API = "/tutorials";
export const ADD_TUTORIAL_API = "/tutorials/create";
export const UPDATE_TUTORIAL_API = "/tutorials/update";
export const DELETE_TUTORIAL_API = "/tutorials/delete";


