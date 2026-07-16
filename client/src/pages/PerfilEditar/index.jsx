import "./styles.css";
import AppNav from "../../components/layouts/AppNav";
import AppLogo from "../../components/layouts/AppLogo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Camera } from "lucide-react";
import { getProfile, updateProfile } from "../../api/profileApi";
import {
  buildSanitizedProfilePayload,
  formatBirthDateInput,
  validateProfileForm,
} from "../../utils/profileValidation";

const emptyForm = {
  name: "",
  email: "",
  ddd: "",
  phoneNumber: "",
  cpf: "",
  birthDate: "",
};

const onlyNumbers = (value) => value.replace(/\D/g, "");

const formatCpf = (value) => {
  const numbers = onlyNumbers(value).slice(0, 11);

  return numbers
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
};

const formatPhone = (value) => {
  const numbers = onlyNumbers(value).slice(0, 9);

  if (numbers.length <= 4) return numbers;
  if (numbers.length <= 8) {
    return numbers.replace(/^(\d{4})(\d+)/, "$1-$2");
  }

  return numbers.replace(/^(\d{5})(\d+)/, "$1-$2");
};

const getPhoneParts = (phone = "") => {
  const numbers = onlyNumbers(phone);

  return {
    ddd: numbers.slice(0, 2),
    phoneNumber: formatPhone(numbers.slice(2)),
  };
};

export default function PerfilEditar() {
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
  });
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentPhone = getPhoneParts(currentProfile.phone);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setCurrentProfile(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          ddd: getPhoneParts(data.phone).ddd,
          phoneNumber: getPhoneParts(data.phone).phoneNumber,
          cpf: data.cpf || "",
          birthDate: data.birthDate || "",
        });
      } catch (error) {
        console.warn("Erro ao carregar perfil para edição:", error.message);
      }
    };

    loadProfile();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    let formattedValue = value;

    if (name === "ddd") formattedValue = onlyNumbers(value).slice(0, 2);
    if (name === "phoneNumber") formattedValue = formatPhone(value);
    if (name === "cpf") formattedValue = formatCpf(value);
    if (name === "birthDate") formattedValue = formatBirthDateInput(value);

    setFormData((currentData) => ({
      ...currentData,
      [name]: formattedValue,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name === "phoneNumber" ? "phone" : name]: undefined,
    }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateProfileForm(formData);
    setErrors(validationErrors);
    setSubmitError("");

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const updatedProfile = buildSanitizedProfilePayload(formData, currentProfile);
      const savedProfile = await updateProfile(updatedProfile);
      setCurrentProfile(savedProfile);
      navigate("/perfil", { replace: true, state: { profileData: savedProfile } });
    } catch (error) {
      console.warn("Erro ao atualizar perfil:", error.message);
      setSubmitError(
        error.message || "Não foi possível salvar as alterações. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="perfil-page perfil-edit-page">
      <div className="perfil-card">
        <header className="perfil-header">
          <button
            type="button"
            className="perfil-back-btn"
            onClick={() => navigate("/perfil")}
            aria-label="Voltar para o perfil"
          >
            <ArrowLeft size={22} />
          </button>

          <AppLogo size="small" />
        </header>

        <main className="perfil-content">
          <section className="perfil-photo-section">
            <div className="perfil-photo-wrapper">
              <div className="perfil-photo"></div>

              <button
                type="button"
                className="perfil-camera-btn"
                aria-label="Alterar foto"
              >
                <Camera size={16} />
              </button>
            </div>

            <button type="button" className="perfil-change-photo-btn">
              TROCAR FOTO
            </button>
          </section>

          <form className="perfil-form" onSubmit={handleSubmit}>
            <div className={`perfil-input-group ${errors.name ? "has-error" : ""}`}>
              <label htmlFor="profile-name">NOME COMPLETO</label>
              <input
                id="profile-name"
                name="name"
                type="text"
                value={formData.name}
                placeholder={currentProfile.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="perfil-field-error">{errors.name}</span>}
            </div>

            <div className={`perfil-input-group ${errors.email ? "has-error" : ""}`}>
              <label htmlFor="profile-email">E-MAIL</label>
              <input
                id="profile-email"
                name="email"
                type="email"
                value={formData.email}
                placeholder={currentProfile.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <span className="perfil-field-error">{errors.email}</span>}
            </div>

            <div className="perfil-input-group">
              <label htmlFor="profile-phone">WHATSAPP / TELEFONE</label>

              <div className="perfil-phone-inputs">
                <div className={`perfil-phone-field perfil-ddd-field ${errors.phone ? "has-error" : ""}`}>
                  <input
                    id="profile-ddd"
                    name="ddd"
                    type="tel"
                    inputMode="numeric"
                    value={formData.ddd}
                    placeholder={currentPhone.ddd}
                    onChange={handleChange}
                    aria-label="DDD"
                    aria-invalid={Boolean(errors.phone)}
                  />
                  <span className="perfil-phone-field-label">DDD</span>
                </div>

                <div className={`perfil-phone-field ${errors.phone ? "has-error" : ""}`}>
                  <input
                    id="profile-phone"
                    name="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    value={formData.phoneNumber}
                    placeholder={currentPhone.phoneNumber}
                    onChange={handleChange}
                    aria-label="Número do telefone"
                    aria-invalid={Boolean(errors.phone)}
                  />
                  <span className="perfil-phone-field-label">NÚMERO</span>
                </div>
              </div>

              {errors.phone && (
                <span className="perfil-field-error">{errors.phone}</span>
              )}
            </div>

            <div className={`perfil-input-group ${errors.cpf ? "has-error" : ""}`}>
              <label htmlFor="profile-cpf">CPF</label>
              <input
                id="profile-cpf"
                name="cpf"
                type="text"
                value={formData.cpf}
                placeholder={currentProfile.cpf}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={14}
                aria-invalid={Boolean(errors.cpf)}
              />
              {errors.cpf && <span className="perfil-field-error">{errors.cpf}</span>}
            </div>

            <div className={`perfil-input-group ${errors.birthDate ? "has-error" : ""}`}>
              <label htmlFor="profile-birth-date">DATA DE NASCIMENTO</label>

              <div className="perfil-date-input">
                <input
                  id="profile-birth-date"
                  name="birthDate"
                  type="text"
                  inputMode="numeric"
                  value={formData.birthDate}
                  placeholder={currentProfile.birthDate}
                  onChange={handleChange}
                  maxLength={10}
                  aria-invalid={Boolean(errors.birthDate)}
                />

                <Calendar size={18} />
              </div>
              {errors.birthDate && (
                <span className="perfil-field-error">{errors.birthDate}</span>
              )}
            </div>

            <button type="submit" className="perfil-save-btn" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </button>

            {submitError && (
              <span className="perfil-submit-error" role="alert">
                {submitError}
              </span>
            )}

            <button
              type="button"
              className="perfil-cancel-btn"
              onClick={() => navigate("/perfil")}
            >
              Cancelar
            </button>
          </form>
        </main>

        <AppNav className="perfil-bottom-nav" active="perfil" />
      </div>
    </div>
  );
}
