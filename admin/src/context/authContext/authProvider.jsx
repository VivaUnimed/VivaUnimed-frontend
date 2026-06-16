import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import { authReducer } from './authReducer';
import { authInitialState } from './authInitialState';
import { AuthContext } from './authContext';
import * as authTypes from './authTypes';
import * as authApi from '../../api/authApi';

const getStoredToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const getStoredUser = () => {
  const storedUser =
    localStorage.getItem('user') || sessionStorage.getItem('user');

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

const saveUserInCurrentStorage = (user) => {
  if (localStorage.getItem('token')) {
    localStorage.setItem('user', JSON.stringify(user));
    return;
  }

  if (sessionStorage.getItem('token')) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }
};

// Inicializa o estado com o que existe no storage.
// A validação real será feita depois pelo /user/me.
const init = (initialState) => {
  const token = getStoredToken();
  const user = getStoredUser();

  return {
    ...initialState,
    token,
    user,
    isAuthenticated: !!token && !!user,
    isSessionLoading: true,
  };
};

export default function AuthProvider({ children }) {
  const [authState, authDispatch] = useReducer(
    authReducer,
    authInitialState,
    init,
  );

  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      const token = getStoredToken();

      if (!token) {
        authDispatch({
          type: authTypes.INIT_SESSION_FAILURE,
          payload: { error: null },
        });

        return;
      }

      authDispatch({ type: authTypes.INIT_SESSION_REQUEST });

      try {
        const user = await authApi.getMe();

        saveUserInCurrentStorage(user);

        authDispatch({
          type: authTypes.INIT_SESSION_SUCCESS,
          payload: {
            token,
            user,
          },
        });
      } catch (error) {
        clearAuthStorage();

        authDispatch({
          type: authTypes.INIT_SESSION_FAILURE,
          payload: { error: error.message },
        });
      }
    };

    loadSession();
  }, []);

  const login = async (userCredentials, rememberMe = true) => {
    return await authApi.login(userCredentials, rememberMe, authDispatch);
  };

  const signup = async (userCredentials) => {
    try {
      await authApi.signup(userCredentials, authDispatch);
      navigate('/login');
    } catch (error) {
      return error;
    }
  };

  const requestPasswordReset = async (email) => {
    return await authApi.requestPasswordReset(email, authDispatch);
  };

  const confirmPasswordReset = async (resetData) => {
    return await authApi.confirmPasswordReset(resetData, authDispatch);
  };

  const logout = async () => {
    await authApi.logout(authDispatch);
    navigate('/login', { replace: true });
  };

  const hasPermission = (permission) => {
    return !!authState.user?.permissions?.includes(permission);
  };

  const hasRole = (role) => {
    return !!authState.user?.roles?.includes(role);
  };

  const isAdmin = () => {
    return hasRole('Admin');
  };

  const isTecnico = () => {
    return hasRole('Tecnico');
  };

  const isPaciente = () => {
    return hasRole('Paciente');
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        authDispatch,

        user: authState.user,
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
        isAuthenticating: authState.isAuthenticating,
        isSessionLoading: authState.isSessionLoading,
        isLoading: authState.isLoading,
        error: authState.error,

        login,
        signup,
        logout,
        requestPasswordReset,
        confirmPasswordReset,

        hasPermission,
        hasRole,
        isAdmin,
        isTecnico,
        isPaciente,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}