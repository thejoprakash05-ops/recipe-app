'use client';

const CUISINES = [
  'All', 'Indian', 'Italian', 'Chinese', 'Mexican', 'French',
  'Japanese', 'Thai', 'Mediterranean', 'American', 'Greek', 'Spanish',
];

export default function CuisineFilter({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border-2 border-gray-300 rounded-full px-4 py-2 pr-8 font-medium text-gray-700 cursor-pointer hover:border-orange-400 focus:border-orange-500 focus:outline-none transition-colors text-sm"
      >
        {CUISINES.map((c) => (
          <option key={c} value={c}>
            {c === 'All' ? 'All Cuisines' : c}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
