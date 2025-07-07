export const GET_FAQS = 'GET_FAQS';
export const GET_FAQS_SUCCESS = 'GET_FAQS_SUCCESS';
export const GET_FAQS_FAIL = 'GET_FAQS_FAIL';
export const ADD_FAQ = 'ADD_FAQ';
export const ADD_FAQ_SUCCESS = 'ADD_FAQ_SUCCESS';
export const ADD_FAQ_FAIL = 'ADD_FAQ_FAIL';
export const UPDATE_FAQ = 'UPDATE_FAQ';
export const UPDATE_FAQ_SUCCESS = 'UPDATE_FAQ_SUCCESS';
export const UPDATE_FAQ_FAIL = 'UPDATE_FAQ_FAIL';
export const DELETE_FAQ = 'DELETE_FAQ';
export const DELETE_FAQ_SUCCESS = 'DELETE_FAQ_SUCCESS';
export const DELETE_FAQ_FAIL = 'DELETE_FAQ_FAIL';

export const getFaqs = () => ({ type: GET_FAQS });
export const getFaqsSuccess = (faqs) => ({ type: GET_FAQS_SUCCESS, payload: faqs });
export const getFaqsFail = (error) => ({ type: GET_FAQS_FAIL, payload: error });

export const addFaq = (faq) => ({ type: ADD_FAQ, payload: faq });
export const addFaqSuccess = (faq) => ({ type: ADD_FAQ_SUCCESS, payload: faq });
export const addFaqFail = (error) => ({ type: ADD_FAQ_FAIL, payload: error });

export const updateFaq = (faq) => ({ type: UPDATE_FAQ, payload: faq });
export const updateFaqSuccess = (faq) => ({ type: UPDATE_FAQ_SUCCESS, payload: faq });
export const updateFaqFail = (error) => ({ type: UPDATE_FAQ_FAIL, payload: error });

export const deleteFaq = (id) => ({ type: DELETE_FAQ, payload: id });
export const deleteFaqSuccess = (id) => ({ type: DELETE_FAQ_SUCCESS, payload: id });
export const deleteFaqFail = (error) => ({ type: DELETE_FAQ_FAIL, payload: error }); 