import api from './api';
import { PAGINATION } from '../utils/constants';

function buildParams(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  params.set('page', String(filters.page || PAGINATION.DEFAULT_PAGE));
  params.set('limit', String(filters.limit || PAGINATION.DEFAULT_LIMIT));
  return params.toString();
}

/**
 * Create a borrow request.
 * @returns {Promise<Object>} the created request
 */
export async function createBorrowRequest({ itemId, notes, dueDate }) {
  const { request } = await api.post('/borrow/request', { itemId, notes, dueDate });
  return request;
}

/** @returns {Promise<{requests: Object[], pagination: Object}>} */
export async function getSentRequests(filters = {}) {
  return api.get(`/borrow/sent?${buildParams(filters)}`);
}

/** @returns {Promise<{requests: Object[], pagination: Object}>} */
export async function getReceivedRequests(filters = {}) {
  return api.get(`/borrow/received?${buildParams(filters)}`);
}

export async function approveRequest(id, reason) {
  const { request } = await api.put(`/borrow/${id}/approve`, { reason });
  return request;
}

export async function rejectRequest(id, reason) {
  const { request } = await api.put(`/borrow/${id}/reject`, { reason });
  return request;
}

export async function markAsBorrowed(id) {
  const { request } = await api.put(`/borrow/${id}/borrow`);
  return request;
}

export async function confirmReturn(id, notes) {
  const { request } = await api.put(`/borrow/${id}/return`, { notes });
  return request;
}

export async function cancelRequest(id) {
  const { request } = await api.put(`/borrow/${id}/cancel`);
  return request;
}

export async function getBorrowRequest(id) {
  const { request } = await api.get(`/borrow/${id}`);
  return request;
}
