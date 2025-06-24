import axios from "axios";
import config from "../config";
import { GET_DOCTOR_API, ADD_DOCTOR_API, GET_PLANS_API, ADD_PLAN_API, GET_STATS_API, DELETE_PLAN_API, UPDATE_PLAN_API } from "./url_helper";

// default
axios.defaults.baseURL = config.API_URL;

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
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
    return axios.get(url, params);
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
