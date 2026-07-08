import { deleteRequest, getRequest, postRequest } from './api';

const normalizeInteresse = (interesse = {}) => ({
  id: interesse.id ?? interesse.especialidadeId ?? interesse._id ?? interesse.value ?? interesse.slug ?? '',
  name:
    interesse.name ??
    interesse.nome ??
    interesse.especialidade ??
    interesse.especialidadeNome ??
    interesse.title ??
    '',
  status:
    interesse.status ??
    interesse.situacao ??
    interesse.type ??
    interesse.tipo ??
    'ESPECIALIDADE',
  selected:
    interesse.selected ??
    interesse.isSelected ??
    interesse.selecionado ??
    interesse.is_selected ??
    false,
  iconName: interesse.iconName ?? interesse.icon ?? interesse.icone ?? '',
});

const extractInteressesFromPayload = (payload) => {
  const normalizeAndSort = (items = []) =>
    items
      .map(normalizeInteresse)
      .filter((item) => item.name)
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  if (Array.isArray(payload)) {
    return normalizeAndSort(payload);
  }

  if (payload && Array.isArray(payload.interesses)) {
    return normalizeAndSort(payload.interesses);
  }

  if (payload && Array.isArray(payload.especialidades)) {
    return normalizeAndSort(payload.especialidades);
  }

  if (payload && Array.isArray(payload.especialidadesCadastradas)) {
    return normalizeAndSort(payload.especialidadesCadastradas);
  }

  if (payload && Array.isArray(payload.specialties)) {
    return normalizeAndSort(payload.specialties);
  }

  if (payload && Array.isArray(payload.items)) {
    return normalizeAndSort(payload.items);
  }

  if (payload && Array.isArray(payload.data)) {
    return normalizeAndSort(payload.data);
  }

  return [];
};

export const getInteresses = async () => {
  try {
    const endpoints = ['/usuarios/interesses', '/especialidades', '/usuarios/especialidades'];

    for (const endpoint of endpoints) {
      try {
        const data = await getRequest(endpoint);
        const parsedData = extractInteressesFromPayload(data);

        if (parsedData.length > 0) {
          return parsedData;
        }
      } catch {
        // Tenta o próximo endpoint caso o atual falhe ou não retorne dados
      }
    }

    return [];
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addInteresse = async (especialidadeId) => {
  try {
    return await postRequest('/usuarios/interesses', { especialidadeId });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeInteresse = async (especialidadeId) => {
  try {
    return await deleteRequest(`/usuarios/interesses/${especialidadeId}`);
  } catch (error) {
    throw new Error(error.message);
  }
};
