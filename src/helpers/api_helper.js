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
  GET_ORDERS_API,
  ADD_ORDER_API,
  GET_IMPRESSIONS_API,
  GET_CONTACT_US_API,
  GET_USER_PROFILE_API,
  UPDATE_USER_PROFILE_API,
  PASSWORD_RESET_API,
  LOGIN_API,
  GET_PATIENT_PROGRESS_API,
  GET_PATIENT_HISTORY_API,
  GET_PAGE_API,
  SET_PAGE_API,
  GET_REFERRALS_API,
  UPDATE_REFERRAL_STATUS_API,
  GET_REFERRAL_AMOUNT_API,
  PAY_REFERRALS_API,
} from "./url_helper";

/**
 * Utility function to properly concatenate URLs and avoid double slashes
 * @param {string} baseUrl - The base URL
 * @param {string} endpoint - The endpoint path
 * @returns {string} - Properly concatenated URL
 */
const buildApiUrl = (baseUrl, endpoint) => {
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
};

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

/**
 * Updates axios headers with current user data from localStorage
 * This should be called after login to ensure headers are updated
 */
export const updateAxiosHeaders = () => {
  const user = JSON.parse(localStorage.getItem("authUser"));
  const token = user ? user.access_token : "";
  const userRole = user?.role || "";
  
  console.log('🔄 Updating axios headers with token:', token ? '***' : 'none', 'role:', userRole);
  
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  axios.defaults.headers.common["X-User-Role"] = userRole;
};

/**
 * Clears axios headers (used on logout)
 */
export const clearAxiosHeaders = () => {
  console.log('🧹 Clearing axios headers');
  delete axios.defaults.headers.common["Authorization"];
  delete axios.defaults.headers.common["X-User-Role"];
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
  try {
    console.log('🔐 Login API called with:', { email, password: '***' });
    
    // Use utility function to build proper URL
    const fullUrl = buildApiUrl(config.API_URL, LOGIN_API);
    console.log('🔗 API URL:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (!response.ok) {
      console.error('❌ Login failed - HTTP error:', response.status);
      throw new Error(data.message || `Login failed with status ${response.status}`);
    }
    
    if (data.status === 'error') {
      console.error('❌ Login failed - API error:', data.message);
      throw new Error(data.message || 'Login failed');
    }
    
    console.log('✅ Login successful');
    return data;
  } catch (error) {
    console.error('💥 Login API error:', error);
    throw error;
  }
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
  api.get(`${GET_SCAN_DETAIL_API}?id=${id}&step_number=${step_number}`);

// Alerts API
export const getAlertsAPI = (userId) =>
  api.get(`${GET_ALERTS_API}?id=${userId}`);

// Patient History API
export const getPatientHistoryAPI = (patientId) =>
  api.get(`${GET_PATIENT_HISTORY_API}?id=${patientId}`);

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
  return api.get(`${GET_PATIENT_PROGRESS_API}?id=${patientId}`);
};

export const saveInstructionsAPI = async (title, content) => {
  return api.create(SET_PAGE_API, {
    title,
    content,
    slug: 'instructions'
  });
};

export const getInstructionsAPI = async () => {
  return api.get(`${GET_PAGE_API}?slug=instructions`);
};

export const saveAlignerTipsAPI = async (title, content) => {
  return api.create(SET_PAGE_API, {
    title,
    content,
    slug: 'aligner-maintenance-tips'
  });
};

export const getAlignerTipsAPI = async () => {
  return api.get(`${GET_PAGE_API}?slug=aligner-maintenance-tips`);
};

export const getImpressionsGuideAPI = async () => {
  return api.get(`${GET_PAGE_API}?slug=impressions-guide`);
};

export const saveImpressionsGuideAPI = async (title, content) => {
  return api.create(SET_PAGE_API, {
    title,
    content,
    slug: 'impressions-guide'
  });
};

export const getTreatmentIssuesAPI = (patientId) =>
  api.get(`${GET_TREATMENT_ISSUES_API}?id=${patientId}`);

// Orders API
export const getOrdersAPI = (patientId) =>
  api.get(`${GET_ORDERS_API}?id=${patientId}`);

export const addOrderAPI = (orderData) => {
  // Ensure the payload includes all required fields
  const payload = {
    patient_id: orderData.patient_id,
    tracking_id: orderData.tracking_id || '',
    main_concern: orderData.main_concern,
    comment: orderData.comment || '',
    date: orderData.date || new Date().toISOString().split('T')[0]
  };
  return api.create(`${ADD_ORDER_API}?id=${orderData.patient_id}`, payload);
};

// Impressions API
export const getImpressionsAPI = (patientId) => {
  return api.get(`${GET_IMPRESSIONS_API}?id=${patientId}`);
};

// Referrals API functions
export const getReferralsAPI = (patientId) => {
  return api.get(`${GET_REFERRALS_API}?id=${patientId}`);
};

export const updateReferralStatusAPI = (referralId, status) => {
  return api.get(`${UPDATE_REFERRAL_STATUS_API}?id=${referralId}&status=${status}`);
};

export const getReferralAmountAPI = (patientId) => {
  return api.get(`${GET_REFERRAL_AMOUNT_API}?id=${patientId}`);
};

export const payReferralsAPI = (patientId) => {
  return api.get(`${PAY_REFERRALS_API}?id=${patientId}`);
};

// Generic Records API functions
export const getSpecialtiesAPI = () => {
  console.log('Calling getSpecialtiesAPI with endpoint:', `${GET_GENERAL_TYPES_API}?type=specialty`);
  return api.get(`${GET_GENERAL_TYPES_API}?type=specialty`);
};

export const getPracticesAPI = () => {
  console.log('Calling getPracticesAPI with endpoint:', `${GET_GENERAL_TYPES_API}?type=practice`);
  return api.get(`${GET_GENERAL_TYPES_API}?type=practice`);
};

// Contact Us API
export const getContactUsAPI = () => api.get(GET_CONTACT_US_API);

// Account/User Management APIs
export const getUserProfileAPI = (userId) => api.get(`${GET_USER_PROFILE_API}?id=${userId}`);
export const updateUserProfileAPI = (userId, userData) => api.update(`${UPDATE_USER_PROFILE_API}?id=${userId}`, userData);
export const passwordResetAPI = (email) => api.create(PASSWORD_RESET_API, { email });
