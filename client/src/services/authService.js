import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} rollNumber
 * @property {string} department
 * @property {number} year
 * @property {string} [avatar]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

function persistSession(user, token) {
  if (!user || !token) {
    throw new Error('Login response was missing user or token');
  }
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

/**
 * @param {{email: string, password: string}} credentials
 */
export async function login(credentials) {
  const { user, token } = await api.post('/auth/login', credentials);
  persistSession(user, token);
  return { user, token };
}

/**
 * @param {Object} data
 */
export async function signup(data) {
  const { user, token } = await api.post('/auth/signup', data);
  persistSession(user, token);
  return { user, token };
}

export async function getCurrentUser() {
  const { user } = await api.get('/auth/me');
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  delete api.defaults.headers.common.Authorization;
}

export function getStoredUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token || token === 'undefined' || token === 'null') return null;
  return token;
}

export function isAuthenticated() {
  return Boolean(getStoredToken());
}

export async function updateProfile(data) {
  const { user } = await api.put('/auth/profile', data);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  return user;
}

export async function changePassword(currentPassword, newPassword) {
  await api.put('/auth/password', { currentPassword, newPassword });
}
