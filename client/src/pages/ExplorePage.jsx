import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useItems } from '../context';
import { ItemGrid, ItemFilter } from '../components/items';
import { Button } from '../components/common/Button';
import { CATEGORIES, CONDITIONS } from '../utils/constants';
import { MOCK_ITEMS } from '../data/mockItems';

import { Grid, List, X } from 'lucide-react';

const INITIAL_FILTERS = {
  page: 1,
  limit: 12,
  sort: 'createdAt',
  order: 'desc'
};

export function ExplorePage() {
  const { items, loading, error, fetchItems, pagination } = useItems();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState(() => ({
    ...INITIAL_FILTERS,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    status: searchParams.get('status') || ''
  }));

  useEffect(() => {
    const nextFilters = {
      ...INITIAL_FILTERS,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      condition: searchParams.get('condition') || '',
      status: searchParams.get('status') || ''
    };
    setFilters(current => JSON.stringify(current) === JSON.stringify(nextFilters) ? current : nextFilters);
  }, [searchParams]);

  // A primitive key means the fetch effect depends on the filter *values*,
  // never on object identity — that is what previously caused render loops.
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    fetchItems(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, fetchItems]);

  const applyFilters = useCallback((patch) => {
    setFilters(prev => ({
      ...prev,
      ...patch,
      page: patch.page === undefined ? 1 : patch.page
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const handleLoadMore = () => {
    const nextPage = (pagination?.page || 1) + 1;
    fetchItems({ ...filters, page: nextPage }, true);
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.condition || filters.status
  );

  // Live data always wins. The offline demo set only appears if the API failed.
  const displayItems = items.length > 0 ? items : (error ? MOCK_ITEMS : []);

  return (
    <div className="explore-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Explore Items</h1>
          <p className="page-description">
            Discover items shared by your campus community. Search, filter, and find exactly what you need.
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="filter-sidebar w-full lg:w-72 flex-shrink-0" aria-label="Filters">
            <ItemFilter
              filters={filters}
              onFiltersChange={applyFilters}
              categories={CATEGORIES}
              conditions={CONDITIONS}
              showAdvanced
            />
          </aside>

          <main className="flex-1 min-w-0">
            <div className="results-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="results-count">
                Showing <strong>{pagination?.total ?? displayItems.length}</strong> items
                {hasActiveFilters && <span className="ml-2 text-primary-600">(filtered)</span>}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <Grid size={18} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <List size={18} />
                  </Button>
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X size={16} />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            <ItemGrid
              items={displayItems}
              variant={viewMode === 'list' ? 'compact' : 'default'}
              loading={loading}
              emptyMessage="No items found matching your criteria"
              emptyAction={
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              }
            />

            {pagination && pagination.page < pagination.totalPages && (
              <div className="load-more mt-8">
                <Button variant="outline" onClick={handleLoadMore} disabled={loading} loading={loading}>
                  Load More
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
