'use client';

import { useState } from 'react';
import { SortField, SortDirection } from '@/types/email';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  dateRange: { from: string | null; to: string | null };
  onDateRangeChange: (range: { from: string | null; to: string | null }) => void;
  selectedCount: number;
  onBulkFavorite: () => void;
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  sortField,
  sortDirection,
  onSortChange,
  dateRange,
  onDateRangeChange,
  selectedCount,
  onBulkFavorite,
}: FilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // toggle sort direction or change sort field
  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      // toggle direction if same field
      onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // default to ascending for new field
      onSortChange(field, 'asc');
    }
  };

  return (
    <div className="bg-white shadow-sm border-none sticky top-0 z-20 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
        {/* search input */}
        <div className="flex flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search emails..."
            className="w-full border rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* filter toggle button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters {isFilterOpen ? '▲' : '▼'}
        </button>

        {/* bulk actions button (only visible when items selected) */}
        {selectedCount > 0 && (
          <button
            onClick={onBulkFavorite}
            className="flex items-center px-3 py-2 border rounded-md bg-yellow-50 hover:bg-yellow-100 text-yellow-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Mark {selectedCount} as favorite
          </button>
        )}
      </div>

      {/* expanded filter section */}
      {isFilterOpen && (
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          {/* sort options */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-2">Sort by</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleSortChange('title')}
                className={`px-3 py-1 rounded-md ${
                  sortField === 'title'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSortChange('date')}
                className={`px-3 py-1 rounded-md ${
                  sortField === 'date'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          {/* date range */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-2">Date range</p>
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={dateRange.from || ''}
                onChange={(e) => {
                  onDateRangeChange({
                    ...dateRange,
                    from: e.target.value || null,
                  });
                }}
                className="flex-1 min-w-[120px] border rounded-md px-3 py-1"
              />
              <span className="self-center">to</span>
              <input
                type="date"
                value={dateRange.to || ''}
                onChange={(e) => {
                  onDateRangeChange({
                    ...dateRange,
                    to: e.target.value || null,
                  });
                }}
                className="flex-1 min-w-[120px] border rounded-md px-3 py-1"
              />
              {(dateRange.from || dateRange.to) && (
                <button
                  onClick={() => onDateRangeChange({ from: null, to: null })}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 