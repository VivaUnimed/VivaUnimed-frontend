import { toast } from 'react-toastify';
import { taskTypes } from '../context/taskContext/taskTypes';
import {
  mergeTaskWithAiInsight,
  mergeTasksWithAiInsights,
  removeTaskAiInsight,
} from '../context/taskContext/taskAiInsightStorage';

import { getRequest, postRequest, putRequest, deleteRequest } from './api';

export const getAllProfessionals = async (dispatch) => {
  dispatch({ type: taskTypes.GET_ALL_TASKS_REQUEST });

  try {
    const data = await getRequest('/tasks/');

    dispatch({
      type: taskTypes.GET_ALL_TASKS_SUCCESS,
      payload: { tasks: mergeTasksWithAiInsights(data.tasks) },
    });
  } catch (error) {
    dispatch({
      type: taskTypes.GET_ALL_TASKS_FAILURE,
      payload: { error: error.message },
    });

    toast.error('Erro ao carregar tarefas!');
  }
};

export const createProfessional = async (newTask, dispatch) => {
  dispatch({ type: taskTypes.CREATE_TASK_REQUEST });

  try {
    // const data = await postRequest('/tasks/', newTask);

    const data = await toast.promise(postRequest('/tasks/', newTask), {
      pending: 'Criando Tarefa...',
      success: 'Tarefa criada com sucesso!',
      error: {
        render({ data }) {
          return (
            data?.response?.data?.message ||
            data?.message ||
            'Erro ao Criar a Tarefa'
          );
        },
      },
    });

    dispatch({
      type: taskTypes.CREATE_TASK_SUCCESS,
      payload: { task: mergeTaskWithAiInsight(data) },
    });
  } catch (error) {
    dispatch({
      type: taskTypes.CREATE_TASK_FAILURE,
      payload: { error: error.message },
    });
  }
};

export const updateProfessional = async (updatedTask, id, dispatch) => {
  dispatch({ type: taskTypes.UPDATE_TASK_REQUEST });

  try {
    // const data = await putRequest(`/tasks/${id}`, updatedTask);

    const data = await toast.promise(putRequest(`/tasks/${id}`, updatedTask), {
      pending: 'Editando Tarefa...',
      success: 'Tarefa editada com sucesso!',
      error: {
        render({ data }) {
          return (
            data?.response?.data?.message ||
            data?.message ||
            'Erro ao editar a Tarefa'
          );
        },
      },
    });

    dispatch({
      type: taskTypes.UPDATE_TASK_SUCCESS,
      payload: { task: mergeTaskWithAiInsight(data) },
    });
  } catch (error) {
    dispatch({
      type: taskTypes.UPDATE_TASK_FAILURE,
      payload: { error: error.message },
    });
  }
};

export const deleteProfessional = async (id, dispatch) => {
  dispatch({ type: taskTypes.DELETE_TASK_REQUEST });

  try {
    // await deleteRequest(`/tasks/${id}`);

    await toast.promise(deleteRequest(`/tasks/${id}`), {
      pending: 'Excluindo Tarefa...',
      success: 'Tarefa excluída com sucesso!',
      error: {
        render({ data }) {
          return (
            data?.response?.data?.message ||
            data?.message ||
            'Erro ao excluir a Tarefa'
          );
        },
      },
    });

    removeTaskAiInsight(id);

    dispatch({ type: taskTypes.DELETE_TASK_SUCCESS, payload: { id } });
  } catch (error) {
    dispatch({
      type: taskTypes.DELETE_TASK_FAILURE,
      payload: { error: error.message },
    });
  }
};