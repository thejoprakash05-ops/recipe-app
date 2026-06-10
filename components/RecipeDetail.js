'use client';

import { useState } from 'react';
import Link from 'next/link';
import NutritionTable from './NutritionTable';

function getSkillLevel(recipe) {
  const time = recipe.readyInMinutes || 30;
  const ingredients = recipe.extendedIngredients?.length || 10;
  if (time <= 25 && ingredients <= 8)
    return { label: 'Easy', color: 'bg-green-100 text-green-700' };
  if (time <= 55 && ingredients <= 16)
    return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
  return { label: 'Hard', color: 'bg-red-100 text-red-700' };
}

const DETAIL_TABS = ['Overview', 'Ingredients', 'Steps', 'Nutrition'];

export default function RecipeDetail({ recipe }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const skill = getSkillLevel(recipe);
  const score = recipe.spoonacularScore
    ? ((recipe.spoonacularScore / 100) * 5).toFixed(1)
    : null;

  const utensils = (recipe.analyzedInstructions?.[0]?.steps ?? [])
    .flatMap((s) => s.equipment ?? [])
    .filter((u, i, arr) => arr.findIndex((x) => x.name === u.name) === i);

  const steps = recipe.analyzedInstructions?.[0]?.steps ?? [];

  const youtubeSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.title + ' recipe')}`;

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl mx-auto">
            {recipe.cuisines?.length > 0 && (
              <div className="flex gap-2 mb-2 flex-wrap">
                {recipe.cuisines.map((c) => (
                  <span key={c} className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {c}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
              {recipe.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-6">
            {recipe.readyInMinutes && (
              <MetaItem icon="clock" label="Total Time" value={`${recipe.readyInMinutes} min`} />
            )}
            {recipe.servings && (
              <MetaItem icon="users" label="Servings" value={recipe.servings} />
            )}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-400">Skill</div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${skill.color}`}>
                  {skill.label}
                </span>
              </div>
            </div>
            {score && (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Popularity</div>
                  <div className="text-sm font-semibold text-gray-800">{score}/5</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tab Pills */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 w-fit overflow-x-auto">
          {DETAIL_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'Overview' && (
          <div className="space-y-5">
            {recipe.summary && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-3">About This Recipe</h2>
                <div
                  className="text-gray-600 leading-relaxed text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: recipe.summary.replace(/<a[^>]*>(.*?)<\/a>/g, '$1'),
                  }}
                />
              </div>
            )}

            {utensils.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-3">Utensils Needed</h2>
                <div className="flex flex-wrap gap-2">
                  {utensils.map((u) => (
                    <span
                      key={u.name}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize"
                    >
                      {u.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {recipe.diets?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-3">Dietary</h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.diets.map((d) => (
                    <span key={d} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm capitalize">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {recipe.sourceUrl && (
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-full font-medium hover:bg-orange-600 transition-colors text-sm"
                >
                  View Full Recipe
                </a>
              )}
              <a
                href={youtubeSearch}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-red-700 transition-colors text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.21 8.21 0 0 0 4.77 1.52V6.75a4.85 4.85 0 0 1-1-.06z" />
                </svg>
                Watch on YouTube
              </a>
            </div>
          </div>
        )}

        {/* Ingredients */}
        {activeTab === 'Ingredients' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">
              Ingredients ({recipe.extendedIngredients?.length ?? 0})
            </h2>
            <div className="divide-y divide-gray-50">
              {(recipe.extendedIngredients ?? []).map((ing, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <img
                    src={`https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`}
                    alt={ing.name}
                    className="w-11 h-11 object-cover rounded-lg bg-gray-50 flex-shrink-0"
                    onError={(e) => { e.target.style.opacity = '0'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 capitalize truncate">{ing.name}</div>
                    <div className="text-xs text-gray-400 truncate">{ing.original}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-semibold text-gray-700 text-sm">
                      {Math.round(ing.amount * 10) / 10}
                    </span>
                    {ing.unit && (
                      <span className="text-gray-400 text-xs ml-1">{ing.unit}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Steps */}
        {activeTab === 'Steps' && (
          <div className="space-y-4">
            {steps.length > 0 ? (
              steps.map((step) => (
                <div key={step.number} className="bg-white rounded-xl p-5 shadow-sm flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed text-sm">{step.step}</p>
                    {step.equipment?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {step.equipment.map((e) => (
                          <span
                            key={e.name}
                            className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded capitalize"
                          >
                            {e.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-6 text-center text-gray-400">
                <p>No step-by-step instructions available.</p>
                {recipe.sourceUrl && (
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-orange-500 hover:underline text-sm"
                  >
                    View instructions on source site →
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Nutrition */}
        {activeTab === 'Nutrition' && (
          <NutritionTable nutrition={recipe.nutrition} />
        )}
      </div>
    </div>
  );
}

function MetaItem({ icon, label, value }) {
  const icons = {
    clock: (
      <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    users: (
      <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
        {icons[icon]}
      </div>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-sm font-semibold text-gray-800">{value}</div>
      </div>
    </div>
  );
}
