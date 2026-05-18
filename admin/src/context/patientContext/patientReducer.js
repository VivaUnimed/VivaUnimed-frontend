import { patientTypes } from './patientTypes';

export const patientReducer = (state, action) => {
  switch (action.type) {
    case patientTypes.CREATE_PATIENT:
      return {
        ...state,
        patients: [action.payload.patient, ...state.patients],
      };

    default:
      return state;
  }
};
