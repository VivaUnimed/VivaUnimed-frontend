import { toast } from 'react-toastify';
import { patientTypes } from '../context/patientContext/patientTypes';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from './api';

const normalizePatientPayload = (patientData = {}) => ({
  userId: Number(patientData.userId),
  birth: patientData.birth,
});

const normalizePatientUpdatePayload = (patientData = {}) => ({
  birth: patientData.birth,
});

export const getAllPatients = async (dispatch) => {
  dispatch?.({ type: patientTypes.GET_ALL_PATIENTS_REQUEST });

  try {
    const data = await getRequest('/patient');
    const patients = Array.isArray(data)
      ? data
      : data?.patients ?? data?.data ?? [];

    dispatch?.({
      type: patientTypes.GET_ALL_PATIENTS_SUCCESS,
      payload: { patients },
    });

    return patients;
  } catch (error) {
    dispatch?.({
      type: patientTypes.GET_ALL_PATIENTS_FAILURE,
      payload: { error: error.message },
    });

    toast.error('Erro ao carregar pacientes!');
    throw error;
  }
};

export const getPatientById = async (id) => {
  return getRequest(`/patient/${id}`);
};

export const createPatient = async (patientData, dispatch) => {
  dispatch?.({ type: patientTypes.CREATE_PATIENT_REQUEST });

  try {
    const normalizedPayload = normalizePatientPayload(patientData);
    const data = await toast.promise(
      postRequest('/patient', normalizedPayload),
      {
        pending: 'Criando paciente...',
        success: 'Paciente criado com sucesso!',
        error: {
          render({ data: toastError }) {
            return (
              toastError?.response?.data?.message ||
              toastError?.message ||
              'Erro ao criar paciente'
            );
          },
        },
      },
    );

    const patient = data?.patient ?? data;

    dispatch?.({
      type: patientTypes.CREATE_PATIENT_SUCCESS,
      payload: { patient },
    });

    return patient;
  } catch (error) {
    dispatch?.({
      type: patientTypes.CREATE_PATIENT_FAILURE,
      payload: { error: error.message },
    });

    throw error;
  }
};

export const updatePatient = async (patientData, id, dispatch) => {
  dispatch?.({ type: patientTypes.UPDATE_PATIENT_REQUEST });

  try {
    const normalizedPayload = normalizePatientUpdatePayload(patientData);
    const data = await toast.promise(
      putRequest(`/patient/${id}`, normalizedPayload),
      {
        pending: 'Atualizando paciente...',
        success: 'Paciente atualizado com sucesso!',
        error: {
          render({ data: toastError }) {
            return (
              toastError?.response?.data?.message ||
              toastError?.message ||
              'Erro ao atualizar paciente'
            );
          },
        },
      },
    );

    const patient = data?.patient ?? data;

    dispatch?.({
      type: patientTypes.UPDATE_PATIENT_SUCCESS,
      payload: { patient, id },
    });

    return patient;
  } catch (error) {
    dispatch?.({
      type: patientTypes.UPDATE_PATIENT_FAILURE,
      payload: { error: error.message },
    });

    throw error;
  }
};

export const deletePatient = async (id, dispatch) => {
  dispatch?.({ type: patientTypes.DELETE_PATIENT_REQUEST });

  try {
    await toast.promise(deleteRequest(`/patient/${id}`), {
      pending: 'Excluindo paciente...',
      success: 'Paciente excluído com sucesso!',
      error: {
        render({ data: toastError }) {
          return (
            toastError?.response?.data?.message ||
            toastError?.message ||
            'Erro ao excluir paciente'
          );
        },
      },
    });

    dispatch?.({
      type: patientTypes.DELETE_PATIENT_SUCCESS,
      payload: { id },
    });

    return id;
  } catch (error) {
    dispatch?.({
      type: patientTypes.DELETE_PATIENT_FAILURE,
      payload: { error: error.message },
    });

    throw error;
  }
};
