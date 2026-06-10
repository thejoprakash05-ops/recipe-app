'use client';

const TAB_CONFIG = [
  { key: 'dessert', label: 'Desserts', emoji: '🍰' },
  { key: 'appetizer', label: 'Appetizers', emoji: '🥗' },
  { key: 'main course', label: 'Main Course', emoji: '🍽️' },
];

export default function TabNav({ active, onChange }) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex">
          {TAB_CONFIG.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm border-b-2 transition-colors ${
                active === key
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
