'use client';

import { useState, useEffect } from 'react';
import { Email, SortField, SortDirection } from '../types/email';
import EmailItem from '@/components/EmailItem';
import Pagination from '@/components/Pagination';

interface EmailListProps {
  emails: Email[];
  selectedEmails: Set<number>;
  onToggleSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  searchTerm: string;
  dateRange: { from: string | null; to: string | null };
  onSelectAll: (ids: number[]) => void;
}

export default function EmailList({
  emails,
  selectedEmails,
  onToggleSelect,
  onToggleFavorite,
  sortField,
  sortDirection,
  searchTerm,
  dateRange,
  onSelectAll,
}: EmailListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
  const emailsPerPage = 10;

  // filter and sort emails
  useEffect(() => {
    let result = [...emails];
    
    // filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(email => 
        email.title.toLowerCase().includes(term)
      );
    }
    
    // filter by date range
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from + "T00:00:00");
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter(email => {
        const emailDate = new Date(email.date);
        return emailDate >= fromDate;
      });
    }
    
    if (dateRange.to) {
      const toDate = new Date(dateRange.to + "T23:59:59");
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(email => {
        const emailDate = new Date(email.date);
        return emailDate <= toDate;
      });
    }
    
    // sort emails
    result.sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // sort by title
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });
    
    setFilteredEmails(result);
    setCurrentPage(1); // reset to first page after filtering
  }, [emails, searchTerm, dateRange, sortField, sortDirection]);

  // calculate pagination
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = filteredEmails.slice(indexOfFirstEmail, indexOfLastEmail);
  const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);

  // handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // get all current visible ids for select all
  const visibleIds = currentEmails.map(email => email.id);
  
  // check if all visible emails are selected
  const allSelected = visibleIds.length > 0 && 
    visibleIds.every(id => selectedEmails.has(id));

  // handle select all current page
  const handleSelectAllVisible = () => {
    if (allSelected) {
      // deselect all visible emails
      const newSelectedIds = [...selectedEmails].filter(id => !visibleIds.includes(id));
      onSelectAll(newSelectedIds);
    } else {
      // select all visible emails
      onSelectAll([...selectedEmails, ...visibleIds]);
    }
  };

  return (
    <div className="w-full">
      {/* select all for current page */}
      <div className="flex items-center mb-2 p-2 bg-gray-100 sticky top-16 z-10">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={handleSelectAllVisible}
          className="w-4 h-4 mr-2"
        />
        <span>
          {allSelected ? 'Deselect All' : 'Select All'} (Current Page)
        </span>
      </div>

      {/* email list */}
      <div className="border rounded-md">
        {currentEmails.length > 0 ? (
          currentEmails.map(email => (
            <EmailItem
              key={email.id}
              email={email}
              isSelected={selectedEmails.has(email.id)}
              onToggleSelect={onToggleSelect}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No emails found
          </div>
        )}
      </div>

      {/* pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
} 