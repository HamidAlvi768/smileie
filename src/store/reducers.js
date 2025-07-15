import { combineReducers } from "redux";
import doctorReducer from "./doctors/reducer";
import plansReducer from "./plans/reducer";
import statsReducer from "./stats/reducer";
import patientsReducer from "./patients/reducer";
import tutorialsReducer from "./tutorials/reducer";
import faqsReducer from './faqs/reducer';
import notificationsReducer from './notifications/reducer';

// Front
import Layout from "./layout/reducer";
import Navigation from "./navigation/reducer";

// Calendar
import calendar from "./calendar/reducer";

// Authentication
import forgetPassword from "./auth/forgetpwd/reducer";
import login from "./auth/login/reducer";
import profile from "./auth/profile/reducer";
import account from "./auth/register/reducer";

import messages from "./messages/reducer";

// Combine all reducers
const appReducer = combineReducers({
  Layout,
  Navigation,
  calendar,
  forgetPassword,
  login,
  profile,
  account,
  doctor: doctorReducer,
  plans: plansReducer,
  stats: statsReducer,
  messages,
  patients: patientsReducer,
  tutorials: tutorialsReducer,
  faqs: faqsReducer,
  notifications: notificationsReducer,
});

// Wrap it in a root reducer that can handle full reset
const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    state = undefined; // Reset entire state
  }
  return appReducer(state, action);
};

export default rootReducer;
