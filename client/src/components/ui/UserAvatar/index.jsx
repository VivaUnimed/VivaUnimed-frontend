import { useAuth } from '../../../context/authContext/authContext';
import './styles.css';

const getUserInitial = (user = {}) => {
  const name = user.name || user.nome || user.fullName || user.email || '';
  return String(name).trim().charAt(0).toUpperCase() || '?';
};

export default function UserAvatar({ className = '' }) {
  const { authState } = useAuth();

  return (
    <div
      className={`user-avatar ${className}`.trim()}
      aria-label={`Usuário ${getUserInitial(authState.user)}`}
    >
      {getUserInitial(authState.user)}
    </div>
  );
}