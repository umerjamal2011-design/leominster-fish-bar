import React, { useEffect, useRef } from 'react';
import { ICONS } from '../constants';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, searchQuery, setSearchQuery, onSearchSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when the overlay opens for better UX
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div
      className="fixed inset-0 bg-dark-bg bg-opacity-95 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 animate-fadeIn"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
      role="dialog"
      aria-modal="true"
    >
      <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white hover:text-gray-300">
        {ICONS.close}
      </button>

      <div className="w-full max-w-2xl text-center">
        <h2 className="text-4xl md:text-5xl font-heading text-white mb-8">Search Our Menu</h2>
        <form onSubmit={handleSubmit} className="flex items-center border-b-2 border-brand-red">
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. 'pizza', 'cod', 'burger'..."
            className="w-full bg-transparent text-white text-2xl md:text-3xl py-3 px-2 leading-tight focus:outline-none placeholder-gray-500"
          />
          <button type="submit" className="p-3 text-white hover:text-gray-300" aria-label="Search">
            {React.cloneElement(ICONS.search, { className: 'h-8 w-8' })}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchOverlay;
