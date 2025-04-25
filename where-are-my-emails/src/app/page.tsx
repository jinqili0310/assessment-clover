'use client';

import { useState, useEffect } from 'react';
import { Email, SortField, SortDirection } from '@/types/email';
import FilterBar from '@/components/FilterBar';
import EmailList from '@/components/EmailList';
import emailData from '@/data/emails.json';

export default function Home() {
  // state for emails
  const [emails, setEmails] = useState<Email[]>([]);
  
  // state for selected emails (across pages)
  const [selectedEmails, setSelectedEmails] = useState<Set<number>>(new Set());
  
  // state for search and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({
    from: null,
    to: null,
  });

  // load emails data
  useEffect(() => {
    setEmails(emailData as Email[]);
    
    // load favorites from localStorage
    const savedFavorites = localStorage.getItem('email-favorites');
    if (savedFavorites) {
      try {
        const favoriteIds = JSON.parse(savedFavorites) as number[];
        setEmails(prevEmails => 
          prevEmails.map(email => ({
            ...email,
            favorite: favoriteIds.includes(email.id)
          }))
        );
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
    
    // load selected emails from localStorage
    const savedSelected = localStorage.getItem('email-selected');
    if (savedSelected) {
      try {
        const selectedIds = JSON.parse(savedSelected) as number[];
        setSelectedEmails(new Set(selectedIds));
      } catch (error) {
        console.error('Error loading selections from localStorage:', error);
      }
    }
  }, []);

  // save favorites to localStorage when they change
  useEffect(() => {
    const favoriteIds = emails
      .filter(email => email.favorite)
      .map(email => email.id);
    
    localStorage.setItem('email-favorites', JSON.stringify(favoriteIds));
  }, [emails]);

  // save selected emails to localStorage when they change
  useEffect(() => {
    localStorage.setItem('email-selected', JSON.stringify([...selectedEmails]));
  }, [selectedEmails]);

  // handle toggling favorite status
  const handleToggleFavorite = (id: number) => {
    setEmails(prevEmails =>
      prevEmails.map(email =>
        email.id === id ? { ...email, favorite: !email.favorite } : email
      )
    );
  };

  // handle toggling selection
  const handleToggleSelect = (id: number) => {
    setSelectedEmails(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  // handle selecting multiple emails
  const handleSelectAll = (ids: number[]) => {
    // For deselection, ids will be filtered IDs to keep
    // For selection, ids will be all ids to have selected
    setSelectedEmails(new Set(ids));
  };

  // handle bulk favorite action
  const handleBulkFavorite = () => {
    setEmails(prevEmails =>
      prevEmails.map(email =>
        selectedEmails.has(email.id) ? { ...email, favorite: true } : email
      )
    );
  };

  // handle sort changes
  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  return (
    <div className="max-w-5xl mx-auto my-0 min-h-screen flex flex-col">
      <header className="p-6 bg-white border-none">
        <h1 className="text-3xl font-bold text-gray-800">Where Are My Emails?</h1>
      </header>

      <main className="flex-1 flex flex-col">
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedCount={selectedEmails.size}
          onBulkFavorite={handleBulkFavorite}
        />

        <div className="py-4 flex-1">
          <EmailList
            emails={emails}
            selectedEmails={selectedEmails}
            onToggleSelect={handleToggleSelect}
            onToggleFavorite={handleToggleFavorite}
            sortField={sortField}
            sortDirection={sortDirection}
            searchTerm={searchTerm}
            dateRange={dateRange}
            onSelectAll={handleSelectAll}
          />
        </div>
      </main>
    </div>
  );
}
