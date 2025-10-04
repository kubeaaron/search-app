import React, { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none"
        placeholder="Search…"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className={`px-6 py-2 rounded-r-full font-semibold transition 
          ${!value.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      >
        Search
      </button>
    </form>
  );
};
