import { LuBell, LuCircleHelp, LuMenu, LuSearch } from 'react-icons/lu';
import './styles.css';

export default function Topbar({ isSidebarHidden, onToggleSidebar }) {
  return (
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

        {/* <div className="topbar__search">
          <LuSearch className="topbar__search-icon" />
          <input
            type="text"
            placeholder="Busca rápida por paciente para registrar cancelamento..."
          />
        </div> */}
      </div>

      <div className="topbar__actions">
        <button type="button" className="topbar__icon-btn">
          <LuBell className="icon-topbar" />
        </button>

        <button type="button" className="topbar__icon-btn">
          <LuCircleHelp className="icon-topbar" />
        </button>

        {/* <button type="button" className="topbar__action-btn">
          + Novo Agendamento
        </button> */}

        <button type="button" className="topbar__profile" aria-label="Perfil">
          <img
            src="https://i.pravatar.cc/40?img=18"
            alt="Avatar do usuário"
            className="topbar__avatar"
          />
        </button>
      </div>
    </header>
  );
}
