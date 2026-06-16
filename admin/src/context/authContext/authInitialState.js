export const authInitialState = {
  token: null,

  user: {
    id: 1,
    name: 'admin',
    email: 'admin@exemplo.com',
    roles: ['Admin'],
    permissions: ['patient.read', 'patient.edit'],
  },

  isAuthenticated: true,
  isAuthenticating: false,

  // Usado para verificar a sessão ao abrir/recarregar a aplicação
  isSessionLoading: true,

  isLoading: false,
  error: null,
  message: '',
};
