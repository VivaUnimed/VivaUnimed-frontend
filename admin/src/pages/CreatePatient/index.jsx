import { useState } from 'react';
import { LuChevronLeft, LuHeartPulse, LuSave, LuUserRoundPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../context/patientContext/patientContext';
import { isPhoneValid, patientStatusOptions } from '../../data/patients';
import './styles.css';

const specialtyOptions = [
  'Cardiologia',
  'Dermatologia',
  'Ortopedia',
  'Pediatria',
  'Ginecologia',
  'Clínica Médica',
  'Nutrologia',
];

const initialFormState = {
  name: '',
  cpf: '',
  phone: '',
  email: '',
  interests: [],
  status: 'Em fila',
};

const isEmailValid = (value) => /\S+@\S+\.\S+/.test(value);

export default function CreatePatient() {
  const navigate = useNavigate();
  const { createPatient } = usePatients();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = ({ target: { name, value } }) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleToggleInterest = (specialty) => {
    const nextInterests = formData.interests.includes(specialty)
      ? formData.interests.filter((currentSpecialty) => currentSpecialty !== specialty)
      : [...formData.interests, specialty];

    setFormData((currentFormData) => ({
      ...currentFormData,
      interests: nextInterests,
    }));

    if (nextInterests.length > 0) {
      setErrors((currentErrors) => {
        if (!currentErrors.interests) {
          return currentErrors;
        }

        const nextErrors = { ...currentErrors };
        delete nextErrors.interests;
        return nextErrors;
      });
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const cpfDigits = formData.cpf.replace(/\D/g, '');

    if (!formData.name.trim()) {
      nextErrors.name = 'Informe o nome completo do paciente.';
    }

    if (cpfDigits.length !== 11) {
      nextErrors.cpf = 'Informe um CPF com 11 dígitos.';
    }

    if (!isPhoneValid(formData.phone)) {
      nextErrors.phone = 'Informe um telefone com DDD válido.';
    }

    if (!isEmailValid(formData.email.trim())) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    if (!formData.interests.length) {
      nextErrors.interests = 'Selecione ao menos uma especialidade de interesse.';
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const patientPayload = {
      ...formData,
      interests: formData.interests.join(', '),
    };
    const patient = createPatient(patientPayload);

    navigate('/patients', {
      state: { successMessage: `Paciente ${patient.name} cadastrado com sucesso.` },
    });
  };

  return (
    <main className="create-patient-page">
      <section className="create-patient-header">
        <div>
          <button
            type="button"
            className="create-patient-back-button"
            onClick={() => navigate('/patients')}
          >
            <LuChevronLeft size={18} />
            Voltar para gestão de pacientes
          </button>

          <div className="create-patient-header__content">
            <span className="create-patient-badge">
              <LuUserRoundPlus size={16} />
              Novo paciente
            </span>
            <h1>Cadastrar paciente</h1>
            <p>
              Preencha os dados do paciente e selecione as especialidades de interesse
              para participação na fila inteligente.
            </p>
          </div>
        </div>
      </section>

      <section className="create-patient-card">
        <form className="create-patient-form" onSubmit={handleSubmit}>
          <div className="create-patient-form__section">
            <div className="create-patient-form__section-header">
              <h2>Dados cadastrais</h2>
              <p>Essas informações serão usadas na busca e identificação do paciente.</p>
            </div>

            <div className="create-patient-form__grid">
              <label className="create-patient-field">
                <span>Nome completo</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Maria da Silva"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name ? <small>{errors.name}</small> : null}
              </label>

              <label className="create-patient-field">
                <span>CPF</span>
                <input
                  type="text"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                />
                {errors.cpf ? <small>{errors.cpf}</small> : null}
              </label>

              <label className="create-patient-field">
                <span>Telefone / WhatsApp</span>
                <input
                  type="text"
                  name="phone"
                  placeholder="(53) 99999-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone ? <small>{errors.phone}</small> : null}
              </label>

              <label className="create-patient-field">
                <span>E-mail</span>
                <input
                  type="email"
                  name="email"
                  placeholder="paciente@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email ? <small>{errors.email}</small> : null}
              </label>
            </div>
          </div>

          <div className="create-patient-form__section">
            <div className="create-patient-form__section-header">
              <h2>Fila inteligente</h2>
              <p>Defina o status inicial e as especialidades de interesse desse paciente.</p>
            </div>

            <div className="create-patient-form__grid create-patient-form__grid--secondary">
              <label className="create-patient-field">
                <span>Status inicial</span>
                <select name="status" value={formData.status} onChange={handleChange}>
                  {patientStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <div className="create-patient-field create-patient-field--full">
                <span>Especialidades de interesse</span>
                <div
                  className={`create-patient-specialties${errors.interests ? ' create-patient-specialties--error' : ''}`}
                  role="group"
                  aria-label="Especialidades de interesse"
                >
                  {specialtyOptions.map((specialty) => {
                    const isSelected = formData.interests.includes(specialty);

                    return (
                      <button
                        key={specialty}
                        type="button"
                        className={`create-patient-specialty-option${isSelected ? ' create-patient-specialty-option--selected' : ''}`}
                        onClick={() => handleToggleInterest(specialty)}
                        aria-pressed={isSelected}
                      >
                        {specialty}
                      </button>
                    );
                  })}
                </div>
                <small className="create-patient-field__hint">
                  Selecione uma ou mais especialidades para inserir o paciente na fila
                  inteligente.
                </small>
                {errors.interests ? <small>{errors.interests}</small> : null}
              </div>
            </div>
          </div>

          <aside className="create-patient-notice">
            <LuHeartPulse size={18} />
            <p>
              Após o cadastro, o paciente passa a aparecer imediatamente na gestão de
              pacientes e permanece salvo mesmo após atualizar a página.
            </p>
          </aside>

          <div className="create-patient-actions">
            <button
              type="button"
              className="create-patient-actions__button create-patient-actions__button--ghost"
              onClick={() => navigate('/patients')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="create-patient-actions__button create-patient-actions__button--primary"
            >
              <LuSave size={16} />
              Salvar paciente
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
