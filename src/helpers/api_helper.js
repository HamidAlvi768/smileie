import axios from "axios";
import config from "../config";
import {
  GET_DOCTOR_API,
  ADD_DOCTOR_API,
  GET_PLANS_API,
  ADD_PLAN_API,
  GET_STATS_API,
  DELETE_PLAN_API,
  UPDATE_PLAN_API,
  SEND_MESSAGE_API,
  GET_GENERAL_TYPES_API,
  ADD_GENERAL_TYPE_API,
  UPDATE_GENERAL_TYPE_API,
  DELETE_GENERAL_TYPE_API,
  GET_MONITORED_PATIENTS_API,
  GET_NOT_MONITORED_PATIENTS_API,
  ADD_PATIENT_API,
  GET_RECENT_PATIENTS_API,
  GET_PATIENT_DETAIL_API,
  GET_TUTORIALS_API,
  ADD_TUTORIAL_API,
  UPDATE_TUTORIAL_API,
  DELETE_TUTORIAL_API,
  UPDATE_PATIENT_DETAIL_API,
  GET_CONSENT_FORMS_API,
  CREATE_3D_PLAN_API,
  GET_3D_PLAN_API,
  UPDATE_3D_PLAN_API,
  DELETE_3D_PLAN_API,
  GET_FAQS_API,
  ADD_FAQ_API,
  UPDATE_FAQ_API,
  DELETE_FAQ_API,
  GET_TREATMENT_STEPS_API,
  GET_SCAN_DETAIL_API,
  GET_ALERTS_API,
  GET_PATIENT_STATS_API,
  CHANGE_ALIGNER_API,
  GET_TREATMENT_ISSUES_API,
} from "./url_helper";

// default
axios.defaults.baseURL = config.API_URL;
const user = JSON.parse(localStorage.getItem("authUser"));
const myId = user?.id;
const token = user ? user.access_token : "";
const userRole = user?.role || "";

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.get["Content-Type"] = "application/json";

// 💥 Add no-cache headers
axios.defaults.headers.get["Cache-Control"] = "no-cache";
axios.defaults.headers.get["Pragma"] = "no-cache";
axios.defaults.headers.get["Expires"] = "0";
axios.defaults.headers.common["Authorization"] = "Bearer " + token;
// Add user role header for role-based API access
axios.defaults.headers.common["X-User-Role"] = userRole;

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
  
  // Also update the user role header when setting authorization
  const user = JSON.parse(localStorage.getItem("authUser"));
  const userRole = user?.role || "";
  axios.defaults.headers.common["X-User-Role"] = userRole;
};

class APIClient {
  /**
   * Fetches data from given url
   */
  get = (url, params) => {
    const currentTime = url.includes("?")
      ? `&_=${Date.now()}`
      : `?_=${Date.now()}`;
    const roleParam = `&role=${userRole}`;
    return axios.get(`${url}${currentTime}${roleParam}`, params);
  };

  /**
   * post given data to url
   */
  create = (url, data) => {
    const roleParam = url.includes("?") ? `&role=${userRole}` : `?role=${userRole}`;
    return axios.post(`${url}${roleParam}`, data);
  };

  /**
   * Updates data
   */
  update = (url, data) => {
    const roleParam = url.includes("?") ? `&role=${userRole}` : `?role=${userRole}`;
    return axios.put(`${url}${roleParam}`, data);
  };

  /**
   * Delete
   */
  delete = (url, config) => {
    const roleParam = url.includes("?") ? `&role=${userRole}` : `?role=${userRole}`;
    return axios.delete(`${url}${roleParam}`, { ...config });
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
export const updatePlanAPI = (plan) =>
  api.update(`${UPDATE_PLAN_API}?id=${plan.id}`, plan);

// Chat messages API
export const getMessagesAPI = async (patientId) => {
  const response = await fetch(
    `${config.API_URL}chat/messages?myid=${myId}&otherid=${patientId}&role=${userRole}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-User-Role": userRole,
        // no cache
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
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
  const response = await fetch(`${config.API_URL}chat/messages/send?role=${userRole}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-User-Role": userRole,
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
  return api.get(GET_GENERAL_TYPES_API + "?parent_id=" + parent_id);
};
export const addGeneralTypeAPI = (type) =>
  api.create(ADD_GENERAL_TYPE_API, type);
export const updateGeneralTypeAPI = (type) =>
  api.update(`${UPDATE_GENERAL_TYPE_API}?id=${type.id}`, type);
export const deleteGeneralTypeAPI = (id) =>
  api.delete(`${DELETE_GENERAL_TYPE_API}?id=${id}`);

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
export const getPatientsAPI = () => api.get(GET_MONITORED_PATIENTS_API); // General patients endpoint
export const getMonitoredPatientsAPI = () =>
  api.get(GET_MONITORED_PATIENTS_API);
export const getNotMonitoredPatientsAPI = () =>
  api.get(GET_NOT_MONITORED_PATIENTS_API);
export const addPatientAPI = (patient) => api.create(ADD_PATIENT_API, patient);
export const getRecentPatientsAPI = () => api.get(GET_RECENT_PATIENTS_API);
export const getPatientDetailAPI = (id) =>
  api.get(`${GET_PATIENT_DETAIL_API}?id=${id}`);
export const updatePatientDetailAPI = (id, data) =>
  api.update(`${UPDATE_PATIENT_DETAIL_API}?id=${id}`, data);
export const getConsentFormsAPI = async (patientId) => {
  return await api.get(`${GET_CONSENT_FORMS_API}?id=${patientId}`);
};

// Tutorials API
export const getTutorialsAPI = () => api.get(GET_TUTORIALS_API);
export const addTutorialAPI = (tutorial) =>
  api.create(ADD_TUTORIAL_API, tutorial);
export const updateTutorialAPI = (tutorial) =>
  api.update(`${UPDATE_TUTORIAL_API}?id=${tutorial.id}`, tutorial);
export const deleteTutorialAPI = (id) =>
  api.delete(`${DELETE_TUTORIAL_API}?id=${id}`);

// 3D Plans API
export const create3DPlanAPI = (planData) =>
  api.create(CREATE_3D_PLAN_API, planData);
export const get3DPlanAPI = (patientId) =>
  api.get(`${GET_3D_PLAN_API}?id=${patientId}`);
export const update3DPlanAPI = (planData) =>
  api.update(`${UPDATE_3D_PLAN_API}?id=${planData.id}`, planData);
export const delete3DPlanAPI = (id) =>
  api.delete(`${DELETE_3D_PLAN_API}?id=${id}`);

// FAQs API
export const getFaqsAPI = () => api.get(GET_FAQS_API);
export const addFaqAPI = (faq) => api.create(ADD_FAQ_API, faq);
export const updateFaqAPI = (faq) =>
  api.update(`${UPDATE_FAQ_API}?id=${faq.id}`, faq);
export const deleteFaqAPI = (id) => api.delete(`${DELETE_FAQ_API}?id=${id}`);

// Treatment Steps (Scans) API
export const getTreatmentStepsAPI = (patientId) =>
  api.get(`${GET_TREATMENT_STEPS_API}?id=${patientId}`);
export const getScanDetailAPI = (id, step_number) =>
  axios.get(`${GET_SCAN_DETAIL_API}?id=${id}&step_number=${step_number}&role=${userRole}`);

// Alerts API
export const getAlertsAPI = (userId) =>
  api.get(`${GET_ALERTS_API}?id=${userId}`);

// Patient History API
export const getPatientHistoryAPI = (patientId) =>
  api.get(`https://smileie.jantrah.com/backend/api/patients/history?id=${patientId}`);

export const getPatientStatsAPI = (patientId) =>
  api.get(`${GET_PATIENT_STATS_API}?id=${patientId}`);

export const changeAlignerAPI = (data) => {
  // data should include patient_id and next_number
  const { patient_id, ...rest } = data;
  return api.create(`${CHANGE_ALIGNER_API}?id=${patient_id}`, { patient_id, ...rest });
};

export const getPatientAlignersAPI = async (patientId) => {
  return api.get(`/patients/aligners?id=${patientId}`);
};

export const getPatientMonitoringScansAPI = async (patientId) => {
  return api.get(`/patients/monitoring?id=${patientId}`);
};

export const getPatientProgressAPI = async (patientId) => {
  return axios.get(`https://smileie.jantrah.com/backend/api/patients/progress?id=${patientId}`);
};

export const saveInstructionsAPI = async (title, content) => {
  return axios.post('https://smileie.jantrah.com/backend/api/page/set', {
    title,
    content
  });
};

export const getInstructionsAPI = async () => {
  return axios.get('https://smileie.jantrah.com/backend/api/page/get?slug=instructions');
};

export const saveAlignerTipsAPI = async (title, content) => {
  return axios.post('https://smileie.jantrah.com/backend/api/page/set', {
    title,
    content,
    slug: 'aligner-maintenance-tips'
  });
};

export const getAlignerTipsAPI = async () => {
  return axios.get('https://smileie.jantrah.com/backend/api/page/get?slug=aligner-maintenance-tips');
};

export const getImpressionsGuideAPI = async () => {
  return axios.get('https://smileie.jantrah.com/backend/api/page/get?slug=impressions-guide');
};

export const saveImpressionsGuideAPI = async (title, content) => {
  return axios.post('https://smileie.jantrah.com/backend/api/page/set', {
    title,
    content,
    slug: 'impressions-guide'
  });
};

export const getTreatmentIssuesAPI = (patientId) =>
  api.get(`${GET_TREATMENT_ISSUES_API}?id=${patientId}`);
