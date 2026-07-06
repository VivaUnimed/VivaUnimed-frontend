import { useReducer } from 'react';

import * as patientApi from '../../api/patientApi';
import * as userApi from '../../api/userApi';
import { buildAdminPatients } from '../../utils/patients/buildAdminPatients';
import { patientContext } from './patientContext';
import { patientInitialState } from './patientInitialState';
import { patientReducer } from './patientReducer';
import * as patientTypes from './patientTypes';

export default function PatientProvider({ children }) {
  const [patientState, patientDispatch] = useReducer(
    patientReducer,
    patientInitialState,
  );

  const buildPendingPatientOperation = (patientData, operation) => {
    const pendingOperation = operation();

    pendingOperation.name = patientData?.name?.trim?.() ?? patientData?.name;

    return pendingOperation;
  };

  const getPatients = async () => {
    patientDispatch({ type: patientTypes.GET_ALL_PATIENTS_REQUEST });

    try {
      const [patients, users] = await Promise.all([
        patientApi.getAllPatients(),
        userApi.getAllUsers(),
      ]);
      const adminPatients = buildAdminPatients(patients, users);

      patientDispatch({
        type: patientTypes.GET_ALL_PATIENTS_SUCCESS,
        payload: {
          patients,
          users,
          adminPatients,
        },
      });

      return adminPatients;
    } catch (error) {
      patientDispatch({
        type: patientTypes.GET_ALL_PATIENTS_FAILURE,
        payload: { error: error.message },
      });

      return [];
    }
  };

  const createPatient = (patientData) => {
    return buildPendingPatientOperation(patientData, async () => {
      patientDispatch({ type: patientTypes.CREATE_PATIENT_REQUEST });

      try {
        const user = await userApi.createUser({
          name: patientData.name,
          email: patientData.email,
          phone: patientData.phone,
          cpf: patientData.cpf,
          password: patientData.password,
          roles: ['Paciente'],
        });

        const patient = await patientApi.createPatient({
          userId: user.id,
          birth: patientData.birth,
        });

        patientDispatch({
          type: patientTypes.CREATE_PATIENT_SUCCESS,
          payload: { patient },
        });

        await getPatients();

        return patient;
      } catch (error) {
        patientDispatch({
          type: patientTypes.CREATE_PATIENT_FAILURE,
          payload: { error: error.message },
        });

        return null;
      }
    });
  };

  const updatePatient = (patientData, patientId) => {
    const normalizedPatientData =
      patientData && typeof patientData === 'object' ? patientData : patientId;
    const normalizedPatientId =
      patientData && typeof patientData === 'object' ? patientId : patientData;

    return buildPendingPatientOperation(normalizedPatientData, async () => {
      patientDispatch({ type: patientTypes.UPDATE_PATIENT_REQUEST });

      try {
        // TODO: editar name, email, phone e cpf apenas quando existir endpoint confirmado de atualização de usuário.
        const patient = await patientApi.updatePatient(
          { birth: normalizedPatientData?.birth },
          normalizedPatientId,
        );

        patientDispatch({
          type: patientTypes.UPDATE_PATIENT_SUCCESS,
          payload: { patient },
        });

        await getPatients();

        return patient;
      } catch (error) {
        patientDispatch({
          type: patientTypes.UPDATE_PATIENT_FAILURE,
          payload: { error: error.message },
        });

        return null;
      }
    });
  };

  const deletePatient = async (patientId) => {
    patientDispatch({ type: patientTypes.DELETE_PATIENT_REQUEST });

    try {
      await patientApi.deletePatient(patientId);

      patientDispatch({
        type: patientTypes.DELETE_PATIENT_SUCCESS,
        payload: { id: patientId },
      });

      await getPatients();

      return patientId;
    } catch (error) {
      patientDispatch({
        type: patientTypes.DELETE_PATIENT_FAILURE,
        payload: { error: error.message },
      });

      return null;
    }
  };

  return (
    <patientContext.Provider
      value={{
        patientState,
        patientDispatch,
        getPatients,
        createPatient,
        updatePatient,
        deletePatient,
      }}
    >
      {children}
    </patientContext.Provider>
  );
}
