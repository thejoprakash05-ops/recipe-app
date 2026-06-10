'use client';

const DIETS = [
  { key: 'all', label: 'All' },
  { key: 'vegetarian', label: 'Veg' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'non-veg', label: 'Non Veg' },
];

export default function DietFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {DIETS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-colors ${
            value === key
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
