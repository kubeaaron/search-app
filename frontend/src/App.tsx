import React, { useState } from 'react';
import { search, SearchResponse } from './api/search';
import { SearchBar } from './components/SearchBar';
import { IndexFilter } from './components/IndexFilter';
import { ResultList } from './components/ResultList';
import { Pagination } from './components/Pagination';
import { ImageModal } from './components/ImageModal';

export const App: React.FC = () => {
  const [resp, setResp] = useState<SearchResponse>({ total: 0, counts: {}, results: [] });
  const [page, setPage] = useState(1);
  const [indexes, setIndexes] = useState<string[]>([]);
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [query, setQuery] = useState<string>(''); // Track query

  const doSearch = async (q: string) => {
    setQuery(q);
    setPage(1);
    const data = await search(q, indexes.length ? indexes : ['people','apps','articles','images'], 1);
    setResp(data);
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    const data = await search(query, indexes.length ? indexes : ['people','apps','articles','images'], newPage);
    setResp(data);
  };

  // Landing page: show only logo and search bar slightly above center
  if (!query) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start bg-white mt-32">
        <img
          src="/logo.png"
          alt="Logo"
          className="mb-8 w-74 h-64 object-contain"
        />
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

        <div className="flex justify-center">
          <IndexFilter selected={indexes} onChange={setIndexes} />
        </div>

        <div className="text-sm text-gray-600 text-center">
          Searched for '<span className="font-medium">{query}</span>'
        </div>

        <div className="p-2 text-sm text-gray-700 text-center">
          {Object.entries(resp.counts ?? {}).map(([idx, c]) => (
            <span key={idx} className="mr-4 capitalize">{idx} ({c})</span>
          ))}
        </div>

        <ResultList results={resp.results} onImageClick={setModalUrl} />
        <Pagination page={page} total={resp.total} onPageChange={handlePageChange} />

        {modalUrl && <ImageModal url={modalUrl} onClose={() => setModalUrl(null)} />}
      </div>
    </div>
  );
};

