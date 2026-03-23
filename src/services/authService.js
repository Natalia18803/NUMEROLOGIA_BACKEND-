import { postData } from './apiClient';

/**
 * Servicio de autenticación
 * @param {object} credentials - Credenciales de login (email, password)
 * @returns {Promise} - Respuesta con token
 */
export const loginService = async (credentials) => {
  return await postData('auth/login', credentials);
};

/**
 * Servicio de registro
 * @param {object} userData - Datos del usuario a registrar
 * @returns {Promise} - Respuesta del registro
 */
export const registerService = async (userData) => {
  return await postData('auth/register', userData);
};

/**
 * Servicio de logout
 * @returns {Promise} - Respuesta del logout
 */
export const logoutService = async () => {
  return await postData('auth/logout', {});
};
