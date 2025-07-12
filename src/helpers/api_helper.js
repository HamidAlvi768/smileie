import axios from "axios";
import config from "../config";
import { GET_DOCTOR_API, ADD_DOCTOR_API, GET_PLANS_API, ADD_PLAN_API, GET_STATS_API, DELETE_PLAN_API, UPDATE_PLAN_API, SEND_MESSAGE_API, GET_GENERAL_TYPES_API, ADD_GENERAL_TYPE_API, UPDATE_GENERAL_TYPE_API, DELETE_GENERAL_TYPE_API, GET_MONITORED_PATIENTS_API, GET_NOT_MONITORED_PATIENTS_API, ADD_PATIENT_API, GET_RECENT_PATIENTS_API, GET_PATIENT_DETAIL_API, GET_TUTORIALS_API, ADD_TUTORIAL_API, UPDATE_TUTORIAL_API, DELETE_TUTORIAL_API, UPDATE_PATIENT_DETAIL_API, GET_CONSENT_FORMS_API, CREATE_3D_PLAN_API, GET_3D_PLAN_API, UPDATE_3D_PLAN_API, DELETE_3D_PLAN_API, GET_FAQS_API, ADD_FAQ_API, UPDATE_FAQ_API, DELETE_FAQ_API, GET_TREATMENT_STEPS_API } from "./url_helper";

// default
axios.defaults.baseURL = config.API_URL;

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.get["Content-Type"] = "application/json";

// 💥 Add no-cache headers
axios.defaults.headers.get['Cache-Control'] = 'no-cache';
axios.defaults.headers.get['Pragma'] = 'no-cache';
axios.defaults.headers.get['Expires'] = '0';


// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Controlled API error (validation, etc.)
    if (
      error.response &&
      error.response.data &&
      error.response.data.status === "error" &&
      error.response.data.message
    ) {
      return Promise.reject(error.response.data.message);
    }
    // Unhandled server error (exception, etc.)
    // Optionally, you can check the request URL or method to customize the message
    if (
      error.config &&
      error.config.url &&
      error.config.url.includes("/doctors/create")
    ) {
      return Promise.reject("Failed to create doctor");
    }
    if (
      error.config &&
      error.config.url &&
      error.config.url.includes("/patients/create")
    ) {
      return Promise.reject("Failed to create patient");
    }
    // Fallback generic message
    return Promise.reject("An error occurred");
  }
);

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */
  get = (url, params) => {
     const currentTime=url.includes("?")?`&_=${Date.now()}`:`?_=${Date.now()}`;
    return axios.get(`${url}${currentTime}`, params);
  };

  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data);
  };

  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.put(url, data);
  };

  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };

// Doctors API
const api = new APIClient();

export const getDoctorsAPI = () => api.get(GET_DOCTOR_API);
export const addDoctorAPI = (doctor) => api.create(ADD_DOCTOR_API, doctor);
export const getPlansAPI = () => api.get(GET_PLANS_API);
export const addPlanAPI = (plan) => api.create(ADD_PLAN_API, plan);
export const getStatsAPI = () => api.get(GET_STATS_API);
export const deletePlanAPI = (id) => api.delete(`${DELETE_PLAN_API}?id=${id}`);
export const updatePlanAPI = (plan) => api.update(`${UPDATE_PLAN_API}?id=${plan.id}`, plan);
const user = JSON.parse(localStorage.getItem("authUser"));
const myId =user?.id ;

// Chat messages API
export const getMessagesAPI = async (patientId) => {
  const response = await fetch(`${config.API_URL}chat/messages?myid=${myId}&otherid=${patientId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // no cache
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
};

export const sendMessageAPI = async (patientId, message, file) => {
  // Get sender_id from localStorage
  const user = JSON.parse(localStorage.getItem("authUser"));
  const sender_id = user?.id || user?.uid;
  if (!sender_id) throw new Error("No sender_id found in authUser");

  // Always send as JSON
  const payload = {
    sender_id: myId,
    receiver_id: patientId,
    message,
    file: file || null,
  };
  const response = await fetch(`${config.API_URL}chat/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add auth headers if needed
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
};

// General Types (Dropdown Settings) API
export const getGeneralTypesAPI = () => api.get(GET_GENERAL_TYPES_API);
export const getGenericRecordsAPI = (parent_id) => {
  return api.get(GET_GENERAL_TYPES_API + "?parent_id=" + parent_id)
};
export const addGeneralTypeAPI = (type) => api.create(ADD_GENERAL_TYPE_API, type);
export const updateGeneralTypeAPI = (type) => api.update(`${UPDATE_GENERAL_TYPE_API}?id=${type.id}`, type);
export const deleteGeneralTypeAPI = (id) => api.delete(`${DELETE_GENERAL_TYPE_API}?id=${id}`);

export const loginAPI = async (email, password) => {
  const response = await fetch(`${config.API_URL}users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Failed to login");
  return response.json();
};

// Patients API
export const getMonitoredPatientsAPI = () => api.get(GET_MONITORED_PATIENTS_API);
export const getNotMonitoredPatientsAPI = () => api.get(GET_NOT_MONITORED_PATIENTS_API);
export const addPatientAPI = (patient) => api.create(ADD_PATIENT_API, patient);
export const getRecentPatientsAPI = () => api.get(GET_RECENT_PATIENTS_API);
export const getPatientDetailAPI = (id) => api.get(`${GET_PATIENT_DETAIL_API}?id=${id}`);
export const updatePatientDetailAPI = (id, data) => api.update(`${UPDATE_PATIENT_DETAIL_API}?id=${id}`, data);
export const getConsentFormsAPI = async (patientId) => {
  return await api.get(`${GET_CONSENT_FORMS_API}?id=${patientId}`);
};

// Tutorials API
export const getTutorialsAPI = () => api.get(GET_TUTORIALS_API);
export const addTutorialAPI = (tutorial) => api.create(ADD_TUTORIAL_API, tutorial);
export const updateTutorialAPI = (tutorial) => api.update(`${UPDATE_TUTORIAL_API}?id=${tutorial.id}`, tutorial);
export const deleteTutorialAPI = (id) => api.delete(`${DELETE_TUTORIAL_API}?id=${id}`);

// 3D Plans API
export const create3DPlanAPI = (planData) => api.create(CREATE_3D_PLAN_API, planData);
export const get3DPlanAPI = (patientId) => api.get(`${GET_3D_PLAN_API}?id=${patientId}`);
export const update3DPlanAPI = (planData) => api.update(`${UPDATE_3D_PLAN_API}?id=${planData.id}`, planData);
export const delete3DPlanAPI = (id) => api.delete(`${DELETE_3D_PLAN_API}?id=${id}`);

// FAQs API
export const getFaqsAPI = () => api.get(GET_FAQS_API);
export const addFaqAPI = (faq) => api.create(ADD_FAQ_API, faq);
export const updateFaqAPI = (faq) => api.update(`${UPDATE_FAQ_API}?id=${faq.id}`, faq);
export const deleteFaqAPI = (id) => api.delete(`${DELETE_FAQ_API}?id=${id}`);

// Treatment Steps (Scans) API
export const getTreatmentStepsAPI = (patientId) => api.get(`${GET_TREATMENT_STEPS_API}?id=${patientId}`);
