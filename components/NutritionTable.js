const SHOW = [
  'Calories', 'Fat', 'Saturated Fat', 'Carbohydrates', 'Net Carbohydrates',
  'Sugar', 'Cholesterol', 'Sodium', 'Protein', 'Fiber',
  'Vitamin C', 'Iron', 'Calcium',
];

const COLORS = {
  Calories: 'text-orange-600',
  Protein: 'text-blue-600',
  Fat: 'text-yellow-600',
  Carbohydrates: 'text-green-600',
};

export default function NutritionTable({ nutrition }) {
  if (!nutrition?.nutrients) {
    return (
      <div className="bg-white rounded-xl p-6 text-center text-gray-400">
        Nutrition data not available.
      </div>
    );
  }

  const nutrients = nutrition.nutrients.filter((n) => SHOW.includes(n.name));
  const calories = nutrients.find((n) => n.name === 'Calories');
  const rest = nutrients.filter((n) => n.name !== 'Calories');

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-gray-800 text-white p-5">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Nutrition Facts</p>
        <p className="text-sm text-gray-300">Per serving</p>
        {calories && (
          <div className="flex items-baseline gap-2 mt-2 border-t border-gray-600 pt-2">
            <span className="text-4xl font-bold">{Math.round(calories.amount)}</span>
            <span className="text-gray-300">calories</span>
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {rest.map((n) => (
          <div key={n.name} className="flex items-center justify-between px-5 py-2.5">
            <span className={`font-medium text-sm ${COLORS[n.name] || 'text-gray-700'}`}>
              {n.name}
            </span>
            <div className="text-right flex items-center gap-3">
              <span className="font-semibold text-gray-800 text-sm">
                {Math.round(n.amount * 10) / 10}
                <span className="text-gray-400 font-normal ml-0.5">{n.unit}</span>
              </span>
              {n.percentOfDailyNeeds != null && (
                <div className="w-16 text-right">
                  <span className="text-xs text-gray-400">
                    {Math.round(n.percentOfDailyNeeds)}% DV
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {nutrition.caloricBreakdown && (
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Caloric Breakdown
          </p>
          <div className="flex gap-4">
            {[
              { label: 'Protein', pct: nutrition.caloricBreakdown.percentProtein, color: 'bg-blue-500' },
              { label: 'Fat', pct: nutrition.caloricBreakdown.percentFat, color: 'bg-yellow-500' },
              { label: 'Carbs', pct: nutrition.caloricBreakdown.percentCarbs, color: 'bg-green-500' },
            ].map(({ label, pct, color }) => (
              <div key={label} className="flex-1 text-center">
                <div className="text-lg font-bold text-gray-800">{Math.round(pct)}%</div>
                <div className={`h-1.5 rounded-full mt-1 ${color}`} style={{ width: `${pct}%`, minWidth: '8px' }} />
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
