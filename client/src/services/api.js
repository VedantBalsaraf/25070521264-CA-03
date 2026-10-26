import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  /**
   * The API always answers with an envelope:
   *   success -> { success: true, message, data: <payload> }
   *   failure -> { success: false, message, errors? }
   *
   * Reading `response.data` therefore handed callers the envelope instead of the
   * payload, which is why tokens/items/users all came back `undefined`. The
   * envelope is unwrapped here once, so every service works with the payload.
   */
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      return body.data;
    }
    return body;
  },
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      const { pathname } = window.location;
      if (pathname !== '/login' && pathname !== '/signup') {
        window.location.href = '/login';
      }
    }

    // Surface the server's own message so forms can show something meaningful
    // instead of "Request failed with status code 400".
    if (serverMessage) {
      error.message = serverMessage;
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
};

export const getAuthToken = () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

export default api;
