import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuBell, LuCircleHelp, LuMenu, LuX } from 'react-icons/lu';
import { useAuth } from '../../../context/authContext/authContext';
import './styles.css';

const adminProfile = [
  { label: 'Nome', value: 'Administrador Unimed' },
  { label: 'Perfil', value: 'Administrador' },
  { label: 'Unidade', value: 'Unimed Litoral Sul/RS' },
  { label: 'E-mail', value: 'admin@unimed.com' },
];

function ProfileModal({ onClose }) {
  return (
    <div className="topbar__modal-backdrop" onClick={onClose}>
      <section
        className="topbar__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="topbar-profile-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="topbar__modal-header">
          <h2 id="topbar-profile-title">Meu perfil</h2>

          <button
            type="button"
            className="topbar__modal-close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <LuX size={18} />
          </button>
        </div>

        <div className="topbar__modal-content">
          {adminProfile.map((item) => (
            <div key={item.label} className="topbar__modal-info">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="topbar__modal-actions">
          <button
            type="button"
            className="topbar__modal-primary-btn"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Topbar({ isSidebarHidden, onToggleSidebar }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const profileMenuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen && !isProfileModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsProfileModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, isProfileModalOpen]);

  useEffect(() => {
    if (!isProfileModalOpen) {
      return undefined;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isProfileModalOpen]);

  const handleToggleMenu = () => {
    setIsMenuOpen((current) => !current);
  };

  const handleOpenProfileModal = () => {
    setIsMenuOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleNavigateToSettings = () => {
    setIsMenuOpen(false);
    navigate('/settings');
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <button
            type="button"
            className={`topbar__sidebar-toggle${isSidebarHidden ? ' topbar__sidebar-toggle--active' : ''}`}
            onClick={onToggleSidebar}
            aria-controls="app-sidebar"
            aria-expanded={!isSidebarHidden}
            aria-label={isSidebarHidden ? 'Mostrar barra lateral' : 'Ocultar barra lateral'}
            title={isSidebarHidden ? 'Mostrar barra lateral' : 'Ocultar barra lateral'}
          >
            <LuMenu className="icon-topbar" />
          </button>
        </div>

        <div className="topbar__actions">
          <button type="button" className="topbar__icon-btn">
            <LuBell className="icon-topbar" />
          </button>

          <button type="button" className="topbar__icon-btn">
            <LuCircleHelp className="icon-topbar" />
          </button>

          <div className="topbar__profile-menu-wrapper" ref={profileMenuRef}>
            <button
              type="button"
              className={`topbar__profile${isMenuOpen ? ' topbar__profile--active' : ''}`}
              aria-label="Perfil"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              aria-controls="topbar-profile-menu"
              onClick={handleToggleMenu}
            >
              <img
                src="https://i.pravatar.cc/40?img=18"
                alt="Avatar do usuário"
                className="topbar__avatar"
              />
            </button>

            {isMenuOpen ? (
              <div
                id="topbar-profile-menu"
                className="topbar__profile-menu"
                role="menu"
                aria-label="Menu do usuário"
              >
                <button
                  type="button"
                  className="topbar__profile-menu-item"
                  role="menuitem"
                  onClick={handleOpenProfileModal}
                >
                  Meu perfil
                </button>

                <button
                  type="button"
                  className="topbar__profile-menu-item"
                  role="menuitem"
                  onClick={handleNavigateToSettings}
                >
                  Configurações
                </button>

                <button
                  type="button"
                  className="topbar__profile-menu-item"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {isProfileModalOpen ? (
        <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
      ) : null}
    </>
  );
}
