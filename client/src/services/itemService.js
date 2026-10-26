import api from './api';
import { PAGINATION } from '../utils/constants';

/**
 * @typedef {Object} Item
 * @property {string} _id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {string} condition
 * @property {string[]} images
 * @property {Object} owner
 * @property {string} status
 * @property {string} location
 * @property {string[]} tags
 * @property {number} borrowCount
 * @property {string} createdAt
 * @property {string} updatedAt
 */

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

/** @returns {Promise<{items: Item[], pagination: Object}>} */
export async function getItems(filters = {}) {
  return api.get(`/items?${buildParams(filters)}`);
}

/** @returns {Promise<Item>} */
export async function getItem(id) {
  const { item } = await api.get(`/items/${id}`);
  return item;
}

/** @returns {Promise<Item>} */
export async function createItem(data) {
  const isFormData = data instanceof FormData;
  const { item } = await api.post('/items', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
  return item;
}

/** @returns {Promise<Item>} */
export async function updateItem(id, data) {
  const { item } = await api.put(`/items/${id}`, data);
  return item;
}

export async function updateItemStatus(id, status) {
  const { item } = await api.patch(`/items/${id}/status`, { status });
  return item;
}

export async function deleteItem(id) {
  await api.delete(`/items/${id}`);
}

/** @returns {Promise<{items: Item[], pagination: Object}>} */
export async function getMyItems(filters = {}) {
  return api.get(`/items/my-items?${buildParams(filters)}`);
}

export async function searchItems(query, filters = {}) {
  return getItems({ ...filters, search: query });
}

export async function getItemsByCategory(category, filters = {}) {
  return getItems({ ...filters, category });
}

/** @returns {Promise<Item[]>} */
export async function getFeaturedItems(limit = 4) {
  const { items } = await api.get(`/items/featured?limit=${limit}`);
  return Array.isArray(items) ? items : [];
}

/** @returns {Promise<Array<{_id:string,count:number}>>} */
export async function getCategories() {
  const { categories } = await api.get('/items/categories');
  return Array.isArray(categories) ? categories : [];
}
