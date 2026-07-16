const onlyNumbers = (value = "") => (value || "").replace(/\D/g, "");

export const normalizeText = (value = "") =>
  (value || "").trim().replace(/\s+/g, " ");

export const formatBirthDateInput = (value = "") => {
  const digits = onlyNumbers(value).slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  if (digits.length <= 6) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

const isValidDate = (value = "") => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) return false;

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);

  if (!year || month < 1 || month > 12) return false;

  const maximumDay = new Date(year, month, 0).getDate();

  return day >= 1 && day <= maximumDay;
};

export const validateProfileForm = (formData = {}) => {
  const errors = {};
  const name = normalizeText(formData.name);
  const email = normalizeText(formData.email);
  const phoneDigits = onlyNumbers(`${formData.ddd || ""}${formData.phoneNumber || ""}`);
  const cpfDigits = onlyNumbers(formData.cpf);
  const birthDate = normalizeText(formData.birthDate);

  if (!name) {
    errors.name = "Informe seu nome completo.";
  } else if (name.length < 3) {
    errors.name = "O nome deve ter pelo menos 3 caracteres.";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email)) {
    errors.email = "Informe um e-mail com formato válido.";
  }

  if (phoneDigits && ![10, 11].includes(phoneDigits.length)) {
    errors.phone = "O telefone deve ter 10 ou 11 dígitos.";
  }

  if (cpfDigits && cpfDigits.length !== 11) {
    errors.cpf = "O CPF deve ter exatamente 11 dígitos.";
  }

  if (!birthDate) {
    errors.birthDate = "Informe a data de nascimento.";
  } else if (!isValidDate(birthDate)) {
    errors.birthDate = "Informe uma data válida.";
  }

  return errors;
};

export const buildSanitizedProfilePayload = (formData = {}, currentProfile = {}) => {
  const name = normalizeText(formData.name);
  const email = normalizeText(formData.email);
  const phoneDigits = onlyNumbers(`${formData.ddd || ""}${formData.phoneNumber || ""}`);
  const cpfDigits = onlyNumbers(formData.cpf);
  const birthDate = normalizeText(formData.birthDate);

  return {
    name: name || currentProfile.name || "",
    email: email || currentProfile.email || "",
    phone: phoneDigits || currentProfile.phone || "",
    cpf: cpfDigits || currentProfile.cpf || "",
    birthDate: birthDate || currentProfile.birthDate || "",
  };
};
