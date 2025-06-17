import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search radio stations...' }) => {
  return (
    <div className="relative w-full max-w-xl mx-auto mb-6">
      <div className="relative rounded-2xl bg-slate-100 dark:bg-gray-900 shadow-inner p-1">
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl px-4 py-2">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent border-none focus:outline-none dark:text-white placeholder-gray-400 text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
