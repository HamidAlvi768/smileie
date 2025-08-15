export const CREATE_CONSENT_FORM_QUESTIONS = 'CREATE_CONSENT_FORM_QUESTIONS';
export const CREATE_CONSENT_FORM_QUESTIONS_SUCCESS = 'CREATE_CONSENT_FORM_QUESTIONS_SUCCESS';
export const CREATE_CONSENT_FORM_QUESTIONS_FAIL = 'CREATE_CONSENT_FORM_QUESTIONS_FAIL';

export const GET_CONSENT_FORM_QUESTIONS = 'GET_CONSENT_FORM_QUESTIONS';
export const GET_CONSENT_FORM_QUESTIONS_SUCCESS = 'GET_CONSENT_FORM_QUESTIONS_SUCCESS';
export const GET_CONSENT_FORM_QUESTIONS_FAIL = 'GET_CONSENT_FORM_QUESTIONS_FAIL';

export const CLEAR_CONSENT_FORM_QUESTIONS_STATE = 'CLEAR_CONSENT_FORM_QUESTIONS_STATE';

export const createConsentFormQuestions = (questions) => ({ 
  type: CREATE_CONSENT_FORM_QUESTIONS, 
  payload: questions 
});
export const createConsentFormQuestionsSuccess = (response) => ({ 
  type: CREATE_CONSENT_FORM_QUESTIONS_SUCCESS, 
  payload: response 
});
export const createConsentFormQuestionsFail = (error) => ({ 
  type: CREATE_CONSENT_FORM_QUESTIONS_FAIL, 
  payload: error 
});

export const getConsentFormQuestions = () => ({ 
  type: GET_CONSENT_FORM_QUESTIONS 
});
export const getConsentFormQuestionsSuccess = (questions) => ({ 
  type: GET_CONSENT_FORM_QUESTIONS_SUCCESS, 
  payload: questions 
});
export const getConsentFormQuestionsFail = (error) => ({ 
  type: GET_CONSENT_FORM_QUESTIONS_FAIL, 
  payload: error 
});

export const clearConsentFormQuestionsState = () => ({ 
  type: CLEAR_CONSENT_FORM_QUESTIONS_STATE 
});
