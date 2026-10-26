import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getItems,
  getMyItems,
  getFeaturedItems,
  getCategories,
  createItem,
  updateItem,
  deleteItem
} from '../services/itemService';

const ItemContext = createContext(undefined);

export const DEFAULT_ITEM_FILTERS = {
  page: 1,
  limit: 12,
  sort: 'createdAt',
  order: 'desc'
};

/**
 * Shared item data layer.
 *
 * The context deliberately does NOT own search/filter state. Each page owns its
 * own filters and passes them into `fetchItems(params)`. Keeping filters out of
 * here is what prevents the request loop that used to re-fire the effect on
 * every render (filter object identity changed each time).
 */
export function ItemProvider({ children }) {
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [myPagination, setMyPagination] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchItems = useCallback(async (params = {}, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getItems({ ...DEFAULT_ITEM_FILTERS, ...params });
      setItems(prev => (append ? [...prev, ...response.items] : response.items));
      setPagination(response.pagination);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyItems = useCallback(async (params = {}, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyItems({ ...DEFAULT_ITEM_FILTERS, ...params });
      setMyItems(prev => (append ? [...prev, ...response.items] : response.items));
      setMyPagination(response.pagination);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch your items');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeaturedItems = useCallback(async (limit = 4) => {
    try {
      const data = await getFeaturedItems(limit);
      setFeaturedItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured items');
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    }
  }, []);

  const handleCreateItem = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const item = await createItem(data);
      setItems(prev => [item, ...prev]);
      setMyItems(prev => [item, ...prev]);
      return item;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create item';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateItem = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const item = await updateItem(id, data);
      setItems(prev => prev.map(i => (i._id === id ? item : i)));
      setMyItems(prev => prev.map(i => (i._id === id ? item : i)));
      return item;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteItem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteItem(id);
      setItems(prev => prev.filter(i => i._id !== id));
      setMyItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedItems();
    fetchCategories();
  }, [fetchFeaturedItems, fetchCategories]);

  const value = {
    items,
    myItems,
    featuredItems,
    categories,
    loading,
    error,
    pagination,
    myPagination,
    fetchItems,
    fetchMyItems,
    fetchFeaturedItems,
    fetchCategories,
    createItem: handleCreateItem,
    updateItem: handleUpdateItem,
    deleteItem: handleDeleteItem,
    clearError
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
}

export function useItems() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
}
