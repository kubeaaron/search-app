import React, { useState } from 'react';

interface Props { onSearch: (q: string) => void; }
export const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  return (
<div className="flex space-x-2">
  <input
    type="text"
    className="border border-gray-300 rounded-lg px-4 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    placeholder="Search for apps, people, etc..."
    value={query}
    onChange={e => setQuery(e.target.value)}
    onKeyDown={e => e.key === 'Enter' && onSearch(query)}
  />
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
    onClick={() => onSearch(query)}
  >
    Search
  </button>
</div>
  );
};
