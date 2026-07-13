import { getRequest } from './api';

const normalizeConsulta = (consulta = {}) => ({
  id: consulta.id ?? consulta._id ?? consulta.slug ?? '',
  slug: consulta.slug ?? consulta.id ?? consulta._id ?? '',
  especialidade: consulta.especialidade ?? consulta.specialty ?? '',
  status: consulta.status ?? consulta.situacao ?? '',
  statusVariant: consulta.statusVariant ?? consulta.status_variant ?? 'gray',
  medico: consulta.medico ?? consulta.doctor ?? consulta.nome_medico ?? '',
  dataResumo: consulta.dataResumo ?? consulta.data_resumo ?? consulta.data ?? '',
  local: consulta.local ?? consulta.unidade ?? consulta.location ?? '',
});

const normalizeConsultaDetalhes = (consulta = {}) => ({
  slug: consulta.slug ?? consulta.id ?? consulta._id ?? '',
  medico: consulta.medico ?? consulta.doctor ?? consulta.nome_medico ?? '',
  especialidade: consulta.especialidade ?? consulta.specialty ?? '',
  data: consulta.data ?? consulta.dataResumo ?? consulta.data_resumo ?? '',
  hora: consulta.hora ?? consulta.horario ?? '',
  local: consulta.local ?? consulta.unidade ?? consulta.location ?? '',
});

// GET /consultas
// Response esperada:
// [
//   {
//     "id": 1,
//     "especialidade": "",
//     "status": "",
//     "statusVariant": "",
//     "medico": "",
//     "dataResumo": "",
//     "local": ""
//   }
// ]
export const getMinhasConsultas = async () => {
  try {
    const data = await getRequest('/consultas');

    if (Array.isArray(data)) {
      return data.map(normalizeConsulta);
    }

    if (data && Array.isArray(data.consultas)) {
      return data.consultas.map(normalizeConsulta);
    }

    return [];
  } catch (error) {
    throw new Error(error.message);
  }
};

// GET /consultas/:slug
export const getConsultaDetalhes = async (slug) => {
  if (!slug) {
    throw new Error('Slug da consulta não informado');
  }

  try {
    const data = await getRequest(`/consultas/${encodeURIComponent(slug)}`);

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.consulta) {
        return normalizeConsultaDetalhes(data.consulta);
      }

      if (data.detalhes) {
        return normalizeConsultaDetalhes(data.detalhes);
      }

      return normalizeConsultaDetalhes(data);
    }

    throw new Error('Resposta inválida do servidor');
  } catch (error) {
    throw new Error(error.message);
  }
};
