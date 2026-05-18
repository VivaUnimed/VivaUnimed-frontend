import { patientTypes } from './patientTypes';

export const patientReducer = (state, action) => {
  switch (action.type) {
    case patientTypes.CREATE_PATIENT:
      return {
        ...state,
        patients: [action.payload.patient, ...state.patients],
      };

    case patientTypes.UPDATE_PATIENT:
      return {
        ...state,
        patients: state.patients.map((patient) =>
          String(patient.id) === String(action.payload.patient.id)
            ? action.payload.patient
            : patient,
        ),
      };

    default:
      return state;
  }
};
