import { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/formatters';
import { CATEGORIES, CONDITIONS } from '../../utils/constants';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Dropdown, DropdownItem } from '../common/Dropdown';
import { useDebounce } from '../../hooks/useUtils';
import { Search, X, Filter, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'createdAt', order: 'desc', label: 'Newest First' },
  { value: 'createdAt', order: 'asc', label: 'Oldest First' },
  { value: 'title', order: 'asc', label: 'Title A-Z' },
  { value: 'title', order: 'desc', label: 'Title Z-A' },
  { value: 'borrowCount', order: 'desc', label: 'Most Borrowed' }
];

/**
 * Fully controlled filter bar.
 *
 * It never writes back into its own props: every interaction emits a small
 * patch through `onFiltersChange`, and the parent is the single owner of filter
 * state. The only local state is the raw search text, which is debounced before
 * it is emitted. This keeps the component free of feedback loops.
 */
export function ItemFilter({
  filters = {},
  onFiltersChange,
  onSearch,
  categories = CATEGORIES,
  conditions = CONDITIONS,
  showAdvanced = true,
  className
}) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(showAdvanced);
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchValue, 350);
  const didMount = useRef(false);
  const lastEmitted = useRef(filters.search || '');

  useEffect(() => {
    const incomingSearch = filters.search || '';
    setSearchValue(current => current === incomingSearch ? current : incomingSearch);
    lastEmitted.current = incomingSearch;
  }, [filters.search]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (debouncedSearch === lastEmitted.current) return;
    lastEmitted.current = debouncedSearch;
    onSearch?.(debouncedSearch);
    onFiltersChange?.({ search: debouncedSearch });
  }, [debouncedSearch, onSearch, onFiltersChange]);

  const emit = (patch) => onFiltersChange?.(patch);

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category ||
    filters.condition ||
    filters.status ||
    (filters.sort && filters.sort !== 'createdAt') ||
    (filters.order && filters.order !== 'desc')
  );

  const clearAllFilters = () => {
    setSearchValue('');
    lastEmitted.current = '';
    emit({
      search: '',
      category: undefined,
      condition: undefined,
      status: undefined,
      sort: 'createdAt',
      order: 'desc',
      page: 1
    });
  };

  return (
    <div className={cn('item-filter', className)}>
      <div className="search-bar flex flex-col sm:flex-row gap-3 mb-6">
        <div className="search-input-wrapper flex-1 relative">
          <Search className="search-icon" size={20} aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search items..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="pl-10"
            aria-label="Search items"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {showAdvancedFilters && (
          <>
            <Dropdown>
              <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown size={16} />
              </Button>
              <div className="dropdown-menu w-64 p-3">
                <div className="space-y-4">
                  <div>
                    <p className="block text-sm font-medium text-gray-700 mb-2">Category</p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      <FilterRadio
                        name="category"
                        label="All Categories"
                        checked={!filters.category}
                        onChange={() => emit({ category: undefined })}
                      />
                      {categories.map(cat => (
                        <FilterRadio
                          key={cat}
                          name="category"
                          label={cat}
                          checked={filters.category === cat}
                          onChange={() => emit({ category: cat })}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="block text-sm font-medium text-gray-700 mb-2">Condition</p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      <FilterRadio
                        name="condition"
                        label="All Conditions"
                        checked={!filters.condition}
                        onChange={() => emit({ condition: undefined })}
                      />
                      {conditions.map(cond => (
                        <FilterRadio
                          key={cond}
                          name="condition"
                          label={cond}
                          checked={filters.condition === cond}
                          onChange={() => emit({ condition: cond })}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="block text-sm font-medium text-gray-700 mb-2">Status</p>
                    <div className="space-y-1">
                      <FilterRadio
                        name="status"
                        label="All Statuses"
                        checked={!filters.status}
                        onChange={() => emit({ status: undefined })}
                      />
                      {['Available', 'Borrowed', 'Maintenance'].map(status => (
                        <FilterRadio
                          key={status}
                          name="status"
                          label={status}
                          checked={filters.status === status}
                          onChange={() => emit({ status })}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="pt-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-error-600 hover:text-error-700"
                      onClick={clearAllFilters}
                    >
                      <X size={16} />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </Dropdown>

            <Dropdown>
              <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                <SlidersHorizontal size={18} />
                <span>Sort</span>
                <ChevronDown size={16} />
              </Button>
              <div className="dropdown-menu w-48 p-2">
                {SORT_OPTIONS.map(option => (
                  <DropdownItem
                    key={`${option.value}-${option.order}`}
                    onClick={() => emit({ sort: option.value, order: option.order, page: 1 })}
                  >
                    {option.label}
                    {filters.sort === option.value && filters.order === option.order && (
                      <span className="ml-auto text-primary-600 font-medium">✓</span>
                    )}
                  </DropdownItem>
                ))}
              </div>
            </Dropdown>
          </>
        )}
      </div>

      {showAdvanced && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full sm:w-auto justify-center"
          onClick={() => setShowAdvancedFilters(v => !v)}
        >
          {showAdvancedFilters ? (
            <>
              <ChevronUp size={16} />
              Hide Filters
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Show Filters
            </>
          )}
        </Button>
      )}
    </div>
  );
}

function FilterRadio({ name, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="radio-input"
      />
      <span className="radio-circle">
        <span className="radio-circle-inner" />
      </span>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
