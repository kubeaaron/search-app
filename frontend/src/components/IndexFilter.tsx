import React from 'react';

const OPTIONS = ['people', 'apps', 'articles', 'images'];
interface Props { selected: string[]; onChange: (sels: string[]) => void; }
export const IndexFilter: React.FC<Props> = ({ selected, onChange }) => {
  const toggle = (opt: string) =>
    onChange(
      selected.includes(opt)
        ? selected.filter(s => s !== opt)
        : [...selected, opt]
    );

  return (
	<div className="flex flex-wrap gap-4">
	  {OPTIONS.map(opt => (
	    <label key={opt} className="flex items-center text-sm text-gray-700">
	      <input
	        type="checkbox"
	        checked={selected.includes(opt)}
	        onChange={() => toggle(opt)}
	        className="mr-2 accent-blue-500"
	      />
	      {opt}
	    </label>
	  ))}
	</div>
);
};
