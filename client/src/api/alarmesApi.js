import { getRequest, postRequest } from './api';

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  return [];
};

const normalizeAlertasPayload = (data) => ({
  urgentes: normalizeList(data?.urgentes),
  consultas: normalizeList(data?.consultas),
  vagas: normalizeList(data?.vagas),
  exames: normalizeList(data?.exames),
  informativos: normalizeList(data?.informativos),
});

const normalizeAlertaUrgentePayload = (data) => {
  if (!data || data === null) {
    return null;
  }

  if (data.ativo === false) {
    return null;
  }

  return data;
};

let cachedAlertasPromise = null;

const fetchAlertasPayload = async () => {
  if (!cachedAlertasPromise) {
    cachedAlertasPromise = getRequest('/usuarios/alarmes');
  }

  return cachedAlertasPromise;
};

export const getTodasNotificacoes = async () => {
  try {
    const data = await fetchAlertasPayload();
    return normalizeAlertasPayload(data || {});
  } catch (error) {
    cachedAlertasPromise = null;
    throw new Error(error.message);
  }
};

export const getAlertaUrgente = async () => {
  try {
    const data = await getRequest('/usuarios/alarmes/urgente');
    return normalizeAlertaUrgentePayload(data);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAlertasUrgentes = async () => {
  try {
    const { urgentes } = await getTodasNotificacoes();
    return urgentes;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getNotificacoesConsultas = async () => {
  try {
    const { consultas } = await getTodasNotificacoes();
    return consultas;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getVagasTempoReal = async () => {
  try {
    const { vagas } = await getTodasNotificacoes();
    return vagas;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getResultadosExames = async () => {
  try {
    const { exames } = await getTodasNotificacoes();
    return exames;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getInformativos = async () => {
  try {
    const { informativos } = await getTodasNotificacoes();
    return informativos;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const aceitarVaga = async (vagaId) => {
  if (!vagaId) {
    throw new Error('ID da vaga é obrigatório para aceitar a vaga.');
  }

  try {
    cachedAlertasPromise = null;
    return await postRequest(`/usuarios/alarmes/vagas/${vagaId}/aceitar`, {});
  } catch (error) {
    cachedAlertasPromise = null;
    throw new Error(error.message);
  }
};

export const getNotificacoesRecentes = async () => {
  return getAlertasUrgentes();
};
