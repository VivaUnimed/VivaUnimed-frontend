import { useEffect, useReducer } from 'react';
import { patientContext as PatientContext } from './patientContext';
import { patientReducer } from './patientReducer';
import { patientInitialState } from './patientInitialState';
import { patientTypes } from './patientTypes';
import { buildPatientFromForm } from '../../data/patients';

const PATIENTS_STORAGE_KEY = 'vivaunimed:patients';

const getInitialPatientState = (baseState) => {
  if (typeof window === 'undefined') {
    return baseState;
  }

  try {
    const storedPatients = window.localStorage.getItem(PATIENTS_STORAGE_KEY);

    if (!storedPatients) {
      return baseState;
    }

    const parsedPatients = JSON.parse(storedPatients);

    if (!Array.isArray(parsedPatients) || parsedPatients.length === 0) {
      return baseState;
    }

    return {
      ...baseState,
      patients: parsedPatients,
    };
  } catch {
    return baseState;
  }
};

export default function PatientProvider({ children }) {
  const [patientState, patientDispatch] = useReducer(
    patientReducer,
    patientInitialState,
    getInitialPatientState,
  );

  useEffect(() => {
    window.localStorage.setItem(
      PATIENTS_STORAGE_KEY,
      JSON.stringify(patientState.patients),
    );
  }, [patientState.patients]);

  const createPatient = (newPatient) => {
    const patient = buildPatientFromForm(newPatient, patientState.patients);

    patientDispatch({
      type: patientTypes.CREATE_PATIENT,
      payload: { patient },
    });

    return patient;
  };

  return (
    <PatientContext.Provider
      value={{
        patientState,
        patientDispatch,
        createPatient,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}
