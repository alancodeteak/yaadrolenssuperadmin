import { Search, Filter } from 'lucide-react';
import { inputClass } from '../../theme/dashboardTheme';
import clsx from 'clsx';

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterValue,
  onFilterChange,
  filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
  className = '',
}) {
  const selectClass = clsx(inputClass, 'py-2 pr-8');

  return (
    <div className={clsx('flex flex-col gap-3 md:flex-row md:items-center', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={onSearchChange}
          className={clsx(inputClass, 'pl-10')}
        />
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
        <select value={filterValue} onChange={onFilterChange} className={selectClass}>
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
