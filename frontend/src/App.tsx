import React, { useState, useEffect } from 'react';
import { search, SearchResponse } from './api/search';
import { SearchBar } from './components/SearchBar';
import { ResultList } from './components/ResultList';
import { Pagination } from './components/Pagination';
import { ImageModal } from './components/ImageModal';
import { useAuth } from './context/AuthContext';

const TABS = ['all', 'people', 'apps', 'articles', 'images'];

export const App: React.FC = () => {
  const { isReady, isAuthenticated, username, logout, login } = useAuth();
  const [resp, setResp] = useState<SearchResponse>({ total: 0, counts: {}, results: [] });
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const hasTriedLogin = React.useRef(false);

  // Trigger login once if auth is ready but user is not authenticated
  useEffect(() => {
    if (isReady && !isAuthenticated && !hasTriedLogin.current) {
      console.log('Auth ready but not authenticated, triggering login');
      hasTriedLogin.current = true;
      login();
    }
  }, [isReady, isAuthenticated, login]);

  // Show loading state while auth is initializing
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show message if authentication is in progress
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div>
            <p className="text-gray-600 mb-2">Authenticating...</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="min-h-screen flex flex-col items-center justify-start bg-white">
        {/* Header with user info and logout */}
        <div className="w-full bg-gray-100 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Welcome, <span className="font-semibold text-gray-800">{username || 'User'}</span>
          </div>
          <button
            onClick={logout}
            className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="relative mb-8 w-144 h-96 flex items-center justify-center mt-16">
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with user info and logout */}
      <div className="w-full bg-gray-100 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Welcome, <span className="font-semibold text-gray-800">{username || 'User'}</span>
        </div>
        <button
          onClick={logout}
          className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-6 flex justify-center">
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
    </div>
  );
};

