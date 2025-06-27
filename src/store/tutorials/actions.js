import {
  GET_TUTORIALS,
  GET_TUTORIALS_SUCCESS,
  GET_TUTORIALS_FAIL,
  ADD_TUTORIAL,
  ADD_TUTORIAL_SUCCESS,
  ADD_TUTORIAL_FAIL,
  UPDATE_TUTORIAL,
  UPDATE_TUTORIAL_SUCCESS,
  UPDATE_TUTORIAL_FAIL,
  DELETE_TUTORIAL,
  DELETE_TUTORIAL_SUCCESS,
  DELETE_TUTORIAL_FAIL
} from "./actionTypes";

export const getTutorials = () => ({ type: GET_TUTORIALS });
export const getTutorialsSuccess = (tutorials) => ({ type: GET_TUTORIALS_SUCCESS, payload: tutorials });
export const getTutorialsFail = (error) => ({ type: GET_TUTORIALS_FAIL, payload: error });

export const addTutorial = (tutorial) => ({ type: ADD_TUTORIAL, payload: tutorial });
export const addTutorialSuccess = (tutorial) => ({ type: ADD_TUTORIAL_SUCCESS, payload: tutorial });
export const addTutorialFail = (error) => ({ type: ADD_TUTORIAL_FAIL, payload: error });

export const updateTutorial = (tutorial) => ({ type: UPDATE_TUTORIAL, payload: tutorial });
export const updateTutorialSuccess = (tutorial) => ({ type: UPDATE_TUTORIAL_SUCCESS, payload: tutorial });
export const updateTutorialFail = (error) => ({ type: UPDATE_TUTORIAL_FAIL, payload: error });

export const deleteTutorial = (id) => ({ type: DELETE_TUTORIAL, payload: id });
export const deleteTutorialSuccess = (id) => ({ type: DELETE_TUTORIAL_SUCCESS, payload: id });
export const deleteTutorialFail = (error) => ({ type: DELETE_TUTORIAL_FAIL, payload: error }); 