import { call, put, takeLatest } from 'redux-saga/effects';
import {
  GET_SPECIALTIES,
  GET_SPECIALTIES_SUCCESS,
  GET_SPECIALTIES_FAIL,
  GET_PRACTICES,
  GET_PRACTICES_SUCCESS,
  GET_PRACTICES_FAIL,
} from './actionTypes';
import { 
  getSpecialtiesSuccess, 
  getSpecialtiesFail, 
  getPracticesSuccess, 
  getPracticesFail 
} from './actions';
import { getSpecialtiesAPI, getPracticesAPI } from '../../helpers/api_helper';

// Get Specialties Saga
function* fetchSpecialties() {
  try {
    console.log('Fetching specialties...');
    const response = yield call(getSpecialtiesAPI);
    console.log('Specialties API Response:', response);
    
    // Handle different possible response structures
    let specialtiesData = [];
    if (response) {
      if (response.status === 'success' && response.data) {
        // Structure: { status: 'success', data: [...] }
        specialtiesData = response.data;
      } else if (Array.isArray(response)) {
        // Structure: [...] (direct array)
        specialtiesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        // Structure: { data: [...] }
        specialtiesData = response.data;
      }
    }
    
    console.log('Processed Specialties Data:', specialtiesData);
    console.log('Specialties Data length:', specialtiesData.length);
    yield put(getSpecialtiesSuccess(specialtiesData));
  } catch (error) {
    console.error('Specialties API Exception:', error);
    yield put(getSpecialtiesFail(error?.response?.data?.message || 'Failed to fetch specialties'));
  }
}

// Get Practices Saga
function* fetchPractices() {
  try {
    console.log('Fetching practices...');
    const response = yield call(getPracticesAPI);
    console.log('Practices API Response:', response);
    
    // Handle different possible response structures
    let practicesData = [];
    if (response) {
      if (response.status === 'success' && response.data) {
        // Structure: { status: 'success', data: [...] }
        practicesData = response.data;
      } else if (Array.isArray(response)) {
        // Structure: [...] (direct array)
        practicesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        // Structure: { data: [...] }
        practicesData = response.data;
      }
    }
    
    console.log('Processed Practices Data:', practicesData);
    console.log('Practices Data length:', practicesData.length);
    yield put(getPracticesSuccess(practicesData));
  } catch (error) {
    console.error('Practices API Exception:', error);
    yield put(getPracticesFail(error?.response?.data?.message || 'Failed to fetch practices'));
  }
}

function* genericRecordsSaga() {
  console.log('Generic records saga initialized');
  console.log('Taking latest GET_SPECIALTIES');
  console.log('Taking latest GET_PRACTICES');
  yield takeLatest(GET_SPECIALTIES, fetchSpecialties);
  yield takeLatest(GET_PRACTICES, fetchPractices);
}

export default genericRecordsSaga; 