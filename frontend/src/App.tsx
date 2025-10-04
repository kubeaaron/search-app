import React, { useState, useEffect } from 'react';
import { search, SearchResponse } from './api/search';
import { SearchBar } from './components/SearchBar';
import { ResultList } from './components/ResultList';
import { Pagination } from './components/Pagination';
import { ImageModal } from './components/ImageModal';

const TABS = ['all', 'people', 'apps', 'articles', 'images'];

export const App: React.FC = () => {
  const [resp, setResp] = useState<SearchResponse>({ total: 0, counts: {}, results: [] });
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (query) {
      doSearch(query);
    }
  }, [activeTab, query]);

  const doSearch = async (q: string) => {
    setQuery(q);
    setPage(1);
    const data = await search(q, activeTab === 'all' ? TABS.slice(1) : [activeTab], 1);
    setResp(data);
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    const data = await search(query, activeTab === 'all' ? TABS.slice(1) : [activeTab], newPage);
    setResp(data);
  };

  // Landing page
  if (!query) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start bg-white mt-16">
        <div className="relative mb-8 w-144 h-96 flex items-center justify-center">
          <img
            src="/logo.gif"
            alt="Logo"
            className="w-144 h-96 object-contain"
          />
          <img
            src="/20250803_2055_MY-CONIC Logo_simple_compose_01k1rr0t21eywt8drrgbpssyqs.png"
            alt="Overlay Logo"
            className="absolute inset-0 w-120 h-85 object-contain pointer-events-none"
            style={{ zIndex: 10 }}
          />
        </div>
        <div className="w-full max-w-xl">
          <SearchBar onSearch={doSearch} />
        </div>
      </div>
    );
  }

  // Results page
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <SearchBar onSearch={doSearch} />

        {/* Tabs and Pagination */}
        <div className="flex items-center justify-between border-b border-gray-200">
          <div className="flex">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 -mb-px font-semibold
                  ${tab === 'all'
                    ? activeTab === tab
                      ? 'bg-blue-800 text-white'
                      : 'bg-gray-800 text-white'
                    : activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:text-blue-600'
                  }
                   transition-colors duration-300 hover:bg-blue-100`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          <Pagination page={page} total={resp.total} onPageChange={handlePageChange} />
        </div>

        {/* Search query and counts */}
        <div className="text-sm text-gray-600 text-center">
          Searched for '<span className="font-medium">{query}</span>'
          {Object.entries(resp.counts ?? {}).map(([idx, c]) => (
            <span key={idx} className="ml-4 capitalize"> | {idx} ({c})</span>
          ))}
        </div>

        <ResultList results={resp.results} onImageClick={setModalUrl} />

        {modalUrl && <ImageModal url={modalUrl} onClose={() => setModalUrl(null)} />}
      </div>
    </div>
  );
};

