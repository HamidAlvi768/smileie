import {
  GET_SPECIALTIES,
  GET_SPECIALTIES_SUCCESS,
  GET_SPECIALTIES_FAIL,
  GET_PRACTICES,
  GET_PRACTICES_SUCCESS,
  GET_PRACTICES_FAIL,
} from './actionTypes';

// Get Specialties Actions
export const getSpecialties = () => {
  console.log('getSpecialties action dispatched');
  return {
    type: GET_SPECIALTIES,
  };
};

export const getSpecialtiesSuccess = (specialties) => ({
  type: GET_SPECIALTIES_SUCCESS,
  payload: specialties,
});

export const getSpecialtiesFail = (error) => ({
  type: GET_SPECIALTIES_FAIL,
  payload: error,
});

// Get Practices Actions
export const getPractices = () => {
  console.log('getPractices action dispatched');
  return {
    type: GET_PRACTICES,
  };
};

export const getPracticesSuccess = (practices) => ({
  type: GET_PRACTICES_SUCCESS,
  payload: practices,
});

export const getPracticesFail = (error) => ({
  type: GET_PRACTICES_FAIL,
  payload: error,
}); 