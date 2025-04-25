'use client';

import { Email } from '@/types/email';

interface EmailItemProps {
  email: Email;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export default function EmailItem({
  email,
  isSelected,
  onToggleSelect,
  onToggleFavorite,
}: EmailItemProps) {
  const formattedDate = new Date(email.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`
      flex items-center p-3 border-b hover:bg-gray-50 transition-colors
      ${isSelected ? 'bg-blue-50' : ''}
    `}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(email.id)}
        className="w-4 h-4 mr-4"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{email.title}</h3>
        <p className="text-sm text-gray-500">{formattedDate}</p>
      </div>
      
      <button
        onClick={() => onToggleFavorite(email.id)}
        aria-label={email.favorite ? "Remove from favorites" : "Add to favorites"}
        className="ml-4 text-gray-400 hover:text-yellow-500 focus:outline-none"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={email.favorite ? "currentColor" : "none"} 
          stroke="currentColor"
          className={`w-6 h-6 ${email.favorite ? 'text-yellow-500' : ''}`}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={email.favorite ? 0 : 1.5}
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      </button>
    </div>
  );
} 