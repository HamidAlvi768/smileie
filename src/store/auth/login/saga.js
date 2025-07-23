import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";
import { loginAPI } from '../../../helpers/api_helper';

const fireBaseBackend = getFirebaseBackend();

function* loginUser({ payload: { user, history } }) {
  try {
    // Use the new loginAPI
    const response = yield call(loginAPI, user.email, user.password);
    console.log('Login response:', response);
    console.log('Response structure:', JSON.stringify(response, null, 2));
    
    if (response && (response.status==="success")) {
      // Handle different response structures
      let userData = null;
      
      if (response.user) {
        userData = response.user;
      } else if (response.data && response.data.user) {
        userData = response.data.user;
      } else if (response.data) {
        userData = response.data;
      } else {
        userData = response;
      }
      
      console.log('User data to store:', userData);
      localStorage.setItem("authUser", JSON.stringify(userData));
      yield put(loginSuccess(response));
      
      // Redirect based on user role
      if (userData.role === 'doctor') {
        history("/patients");
      } else {
        history("/dashboard");
      }
    } else {
      // If response is missing expected fields, treat as error
      yield put(apiError(response.message));
    }
  } catch (error) {
    console.log(error)
    let message = error;
      message = error.message??"Something went wrong!";
    yield put(apiError(message));
  }
}

function* logoutUser() {
  try {
    localStorage.removeItem("authUser");
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(LOGOUT_USER, response));
    } else {
      yield put(logoutUserSuccess(LOGOUT_USER, true));
    }
  } catch (error) {
    yield put(apiError(LOGOUT_USER, error));
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(fireBaseBackend.socialLoginUser, data, type);
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    } else {
      const response = yield call(postSocialLogin, data);
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    }
    history("/dashboard");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
