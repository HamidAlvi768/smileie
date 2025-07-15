//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register";

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-fake-login";
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
export const GET_MONITORED_PATIENTS_API = `/patients`;
export const GET_NOT_MONITORED_PATIENTS_API = `/patients?type=not_monitored`;
export const ADD_PATIENT_API = "/patients/create";
export const GET_RECENT_PATIENTS_API = "/patients/recent";
export const GET_PATIENT_DETAIL_API = "/patients/view";
export const UPDATE_PATIENT_DETAIL_API = "/patients/update";
export const GET_CONSENT_FORMS_API = "/consent-forms";

//tutorials
export const GET_TUTORIALS_API = "/tutorials";
export const ADD_TUTORIAL_API = "/tutorials/create";
export const UPDATE_TUTORIAL_API = "/tutorials/update";
export const DELETE_TUTORIAL_API = "/tutorials/delete";

//3d-plans
export const CREATE_3D_PLAN_API = "/3d-plans/create";
export const GET_3D_PLAN_API = "/3d-plans/view";
export const UPDATE_3D_PLAN_API = "/3d-plans/update";
export const DELETE_3D_PLAN_API = "/3d-plans/delete";

//faqs
export const GET_FAQS_API = '/faqs';
export const ADD_FAQ_API = '/faqs/create';
export const UPDATE_FAQ_API = '/faqs/update';
export const DELETE_FAQ_API = '/faqs/delete';

//treatment steps (scans)
export const GET_TREATMENT_STEPS_API = '/treatment/steps';
export const GET_SCAN_DETAIL_API = '/treatment/scans';


