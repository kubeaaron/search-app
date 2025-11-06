import React from 'react';

interface Props { url: string; onClose: () => void; }
export const ImageModal: React.FC<Props> = ({ url, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded">
      <button onClick={onClose} className="mb-2">Close</button>
      <img src={url} alt="full-size" className="max-h-screen max-w-screen" />
    </div>
  </div>
);