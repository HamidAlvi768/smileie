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
import { loginAPI, updateAxiosHeaders, clearAxiosHeaders } from '../../../helpers/api_helper';

const fireBaseBackend = getFirebaseBackend();

function* loginUser({ payload: { user, history } }) {
  try {
    console.log('🚀 Login saga started with user:', { email: user.email, password: '***' });
    
    // Use the new loginAPI
    const response = yield call(loginAPI, user.email, user.password);
    console.log('📊 Login response received:', response);
    
    if (response && response.status === "success") {
      console.log('✅ Login successful, processing user data...');
      
      // Handle different response structures
      let userData = null;
      
      if (response.user) {
        userData = response.user;
        console.log('👤 User data from response.user:', userData);
      } else if (response.data && response.data.user) {
        userData = response.data.user;
        console.log('👤 User data from response.data.user:', userData);
      } else if (response.data) {
        userData = response.data;
        console.log('👤 User data from response.data:', userData);
      } else {
        userData = response;
        console.log('👤 User data from response:', userData);
      }
      
      // Validate required fields
      if (!userData || !userData.id) {
        console.error('❌ Invalid user data - missing required fields:', userData);
        yield put(apiError('Invalid user data received from server'));
        return;
      }
      
      console.log('💾 Storing user data in localStorage:', userData);
      localStorage.setItem("authUser", JSON.stringify(userData));
      
      // Update axios headers with new token
      if (userData.access_token) {
        console.log('🔑 Setting authorization headers with new token');
        updateAxiosHeaders(); // Update axios headers with new token
      }
      
      yield put(loginSuccess(response));
      
      // Redirect based on user role
      const role = userData.role || 'user';
      console.log('🎯 Redirecting user with role:', role);
      
      if (role === 'doctor') {
        history("/patients");
      } else {
        history("/dashboard");
      }
    } else {
      console.error('❌ Login failed - invalid response structure:', response);
      const errorMessage = response?.message || 'Invalid response from server';
      yield put(apiError(errorMessage));
    }
  } catch (error) {
    console.error('💥 Login saga error:', error);
    let message = 'Something went wrong!';
    
    if (error.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    console.error('🚨 Final error message:', message);
    yield put(apiError(message));
  }
}

function* logoutUser() {
  try {
    console.log('🚪 Logout saga started');
    localStorage.removeItem("authUser");
    clearAxiosHeaders(); // Clear axios headers
    
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(LOGOUT_USER, response));
    } else {
      yield put(logoutUserSuccess(LOGOUT_USER, true));
    }
    console.log('✅ Logout completed');
  } catch (error) {
    console.error('💥 Logout error:', error);
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
