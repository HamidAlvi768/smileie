import { call, put, takeEvery } from "redux-saga/effects";
import { GET_TUTORIALS, ADD_TUTORIAL, UPDATE_TUTORIAL, DELETE_TUTORIAL } from "./actionTypes";
import { getTutorialsSuccess, getTutorialsFail, addTutorialSuccess, addTutorialFail, getTutorials, updateTutorialSuccess, updateTutorialFail, deleteTutorialSuccess, deleteTutorialFail } from "./actions";
import { getTutorialsAPI, addTutorialAPI, updateTutorialAPI, deleteTutorialAPI } from "../../helpers/api_helper";

function* fetchTutorials() {
  try {
    const response = yield call(getTutorialsAPI);
    yield put(getTutorialsSuccess(response));
  } catch (error) {
    yield put(getTutorialsFail(error));
  }
}

function* addTutorialSaga({ payload }) {
  try {
    const response = yield call(addTutorialAPI, payload);
    yield put(addTutorialSuccess(response));
    yield put(getTutorials()); // Refresh list
  } catch (error) {
    yield put(addTutorialFail(error));
  }
}

function* updateTutorialSaga({ payload }) {
  try {
    const response = yield call(updateTutorialAPI, payload);
    yield put(updateTutorialSuccess(response));
    yield put(getTutorials()); // Refresh list
  } catch (error) {
    yield put(updateTutorialFail(error));
  }
}

function* deleteTutorialSaga({ payload }) {
  try {
    yield call(deleteTutorialAPI, payload);
    yield put(deleteTutorialSuccess(payload));
    yield put(getTutorials()); // Refresh list
  } catch (error) {
    yield put(deleteTutorialFail(error));
  }
}

function* tutorialsSaga() {
  yield takeEvery(GET_TUTORIALS, fetchTutorials);
  yield takeEvery(ADD_TUTORIAL, addTutorialSaga);
  yield takeEvery(UPDATE_TUTORIAL, updateTutorialSaga);
  yield takeEvery(DELETE_TUTORIAL, deleteTutorialSaga);
}

export default tutorialsSaga; 