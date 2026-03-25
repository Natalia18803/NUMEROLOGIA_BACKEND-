// src/api.js
const API_URL = '/api';

export async function apiFetch(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['x-token'] = token;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    console.error('API Error:', error);
    return { status: 500, ok: false, data: { msg: 'Error de conexión con el servidor' } };
  }
}

export const AuthService = {
    login: async (email, password) => await apiFetch('/auth/login', 'POST', { email, password }),
    register: async (nombre, email, password, fecha_nacimiento) => await apiFetch('/auth/registro', 'POST', { nombre, email, password, fecha_nacimiento }),
    getProfile: async () => await apiFetch('/auth/perfil', 'GET'),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    isAuthenticated: () => !!localStorage.getItem('token'),
    getUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};
