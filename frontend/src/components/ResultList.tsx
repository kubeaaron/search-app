import React from 'react';
import type { SearchResult } from '../api/search';

interface Props {
  results: SearchResult[] | null | undefined;
  onImageClick: (url: string) => void;
}

export const ResultList: React.FC<Props> = ({ results, onImageClick }) => {
  if (!results || results.length === 0) {
    return <div className="text-gray-500 text-lg mt-4 text-center font-bold">No results found.</div>;
  }

  return (
    <div className="space-y-4">
      {results.map((r, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-2xl p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-200 relative"
        >
          <div className="absolute top-3 right-3 text-xs text-gray-400 uppercase tracking-wider">
            {r.index}
          </div>

          {/* People */}
          {r.index === 'people' && (
            <div>
              <div className="text-xl font-bold text-gray-800">
                {Array.isArray(r.fields.name) ? r.fields.name[0] : r.fields.name}
              </div>
              <div className="text-gray-600">
                {Array.isArray(r.fields.job_title) ? r.fields.job_title[0] : r.fields.job_title} –{' '}
                {Array.isArray(r.fields.department) ? r.fields.department[0] : r.fields.department}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {Array.isArray(r.fields.phone) ? r.fields.phone[0] : r.fields.phone}
              </div>
            </div>
          )}

          {/* Apps */}
          {r.index === 'apps' && (
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {r.fields.icon_url && (
                  <img
                    src={Array.isArray(r.fields.icon_url) ? r.fields.icon_url[0] : r.fields.icon_url}
                    alt="icon"
                    className="w-10 h-10 object-contain"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-800">
                  {Array.isArray(r.fields.name) ? r.fields.name[0] : r.fields.name}
                </div>
                <a
                  href={Array.isArray(r.fields.link) ? r.fields.link[0] : r.fields.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Visit
                </a>
                <p className="text-gray-600 mt-1 text-sm">
                  {Array.isArray(r.fields.description) ? r.fields.description[0] : r.fields.description}
                </p>
              </div>
            </div>
          )}

          {/* Articles */}
          {r.index === 'articles' && (
            <div>
              <a
                href={Array.isArray(r.fields.url) ? r.fields.url[0] : r.fields.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-700 hover:underline"
              >
                {Array.isArray(r.fields.title) ? r.fields.title[0] : r.fields.title}
              </a>
              <p className="text-gray-600 mt-1 text-sm">
                {Array.isArray(r.fields.snippet) ? r.fields.snippet[0] : r.fields.snippet}
              </p>
            </div>
          )}

          {/* Images */}
          {r.index === 'images' && (
            (() => {
              const fullPath = Array.isArray(r.fields.full_path) ? r.fields.full_path[0] : r.fields.full_path;
              const title = Array.isArray(r.fields.title) ? r.fields.title[0] : r.fields.title;
              if (!fullPath) return null;
              const filename = fullPath.split('/').pop();

              return (
                <div className="flex flex-col items-center">
                  <img
                    src={fullPath}
                    alt={title || ''}
                    className="w-full max-w-xs rounded-lg cursor-pointer hover:opacity-80 transition duration-200"
                    onClick={() => onImageClick(fullPath)}
                  />
                  {filename && (
                    <div className="text-sm text-gray-500 mt-2">{filename}</div>
                  )}
                </div>
              );
            })()
          )}
        </div>
      ))}
    </div>
  );
};

