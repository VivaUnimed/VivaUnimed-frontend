import "./styles.css";
import AppNav from "../../components/layouts/AppNav";
import AppLogo from "../../components/layouts/AppLogo";
import UserAvatar from "../../components/ui/UserAvatar";
import { useAuth } from "../../context/authContext/authContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../../api/profileApi";

import {
  ArrowLeft,
  Calendar,
  Pencil,
  LogOut,
} from "lucide-react";

export default function Perfil() {
  const { logout, authState, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
        updateUser(data);
      } catch (error) {
        console.warn("Erro ao carregar perfil:", error.message);
      }
    };

    loadProfile();
  }, [updateUser]);

  return (
    <div className="perfil-page">
      <div className="perfil-card">
        <header className="perfil-header">
          <button
            type="button"
            className="perfil-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
          >
            <ArrowLeft size={22} />
          </button>

          <AppLogo size="small" />
        </header>

        <main className="perfil-content">
          <section className="perfil-photo-section">
            <div className="perfil-photo-wrapper">
              <UserAvatar className="user-avatar-large" />
            </div>
          </section>

          <form className="perfil-form">
            <div className="perfil-input-group">
              <label>NOME COMPLETO</label>

              <input type="text" value={profileData.name} readOnly />
            </div>

            <div className="perfil-input-group">
              <label>E-MAIL</label>

              <input type="email" value={profileData.email} readOnly />
            </div>

            <div className="perfil-input-group">
              <label>WHATSAPP / TELEFONE</label>

              <input type="text" value={profileData.phone} readOnly />
            </div>

            <div className="perfil-input-group">
              <label>CPF</label>

              <input type="text" value={profileData.cpf} readOnly />
            </div>

            <div className="perfil-input-group">
              <label>DATA DE NASCIMENTO</label>

              <div className="perfil-date-input">
                <input type="text" value={profileData.birthDate} readOnly />

                <Calendar size={18} />
              </div>
            </div>

            <button
              type="button"
              className="perfil-save-btn"
              onClick={() => navigate("/perfil/editar")}
            >
              <Pencil size={18} />
              Alterar dados
            </button>

            <button
              type="button"
              className="perfil-logout-btn"
              onClick={logout}
              disabled={authState.isLoading}
            >
              <LogOut size={18} />
              Sair
            </button>
          </form>
        </main>

        <AppNav className="perfil-bottom-nav" active="perfil" />
      </div>
    </div>
  );
}
