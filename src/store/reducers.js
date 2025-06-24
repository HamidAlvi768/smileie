import { combineReducers } from "redux";
import doctorReducer from "./doctors/reducer";
import plansReducer from "./plans/reducer";
import statsReducer from "./stats/reducer";

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

const rootReducer = combineReducers({
  // public
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
});

export default rootReducer;
