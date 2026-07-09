import { getRequest } from './api';

const normalizeList = (data, fallbackKey) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.[fallbackKey])) {
    return data[fallbackKey];
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

export const getNotificacoesRecentes = async () => {
  try {
    const data = await getRequest('/usuarios/alarmes/recentes');
    return normalizeList(data, 'notificacoes');
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getVagasTempoReal = async () => {
  try {
    const data = await getRequest('/usuarios/alarmes/vagas');
    return normalizeList(data, 'vagas');
  } catch (error) {
    throw new Error(error.message);
  }
};
