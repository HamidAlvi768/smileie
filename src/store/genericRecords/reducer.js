import {
  GET_SPECIALTIES,
  GET_SPECIALTIES_SUCCESS,
  GET_SPECIALTIES_FAIL,
  GET_PRACTICES,
  GET_PRACTICES_SUCCESS,
  GET_PRACTICES_FAIL,
} from './actionTypes';

const initialState = {
  specialties: [],
  practices: [],
  specialtiesLoading: false,
  practicesLoading: false,
  error: null,
};

const genericRecordsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPECIALTIES:
      console.log('Reducer: GET_SPECIALTIES - Setting loading to true');
      return {
        ...state,
        specialtiesLoading: true,
        error: null,
      };

    case GET_SPECIALTIES_SUCCESS:
      console.log('Reducer: GET_SPECIALTIES_SUCCESS', action.payload);
      return {
        ...state,
        specialties: action.payload,
        specialtiesLoading: false,
        error: null,
      };

    case GET_SPECIALTIES_FAIL:
      return {
        ...state,
        specialtiesLoading: false,
        error: action.payload,
      };

    case GET_PRACTICES:
      console.log('Reducer: GET_PRACTICES - Setting loading to true');
      return {
        ...state,
        practicesLoading: true,
        error: null,
      };

    case GET_PRACTICES_SUCCESS:
      console.log('Reducer: GET_PRACTICES_SUCCESS', action.payload);
      return {
        ...state,
        practices: action.payload,
        practicesLoading: false,
        error: null,
      };

    case GET_PRACTICES_FAIL:
      return {
        ...state,
        practicesLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default genericRecordsReducer; 