'use client';

import { useState, useEffect, useCallback } from 'react';
import TabNav from '@/components/TabNav';
import RecipeCard from '@/components/RecipeCard';
import ImageUpload from '@/components/ImageUpload';
import CuisineFilter from '@/components/CuisineFilter';
import DietFilter from '@/components/DietFilter';
import CameraCapture from '@/components/CameraCapture';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dessert');
  const [cuisine, setCuisine] = useState('All');
  const [diet, setDiet] = useState('vegetarian');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraFile, setCameraFile] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ type: activeTab, sort: 'popularity' });
      if (cuisine !== 'All') params.set('cuisine', cuisine.toLowerCase());
      if (ingredients.length > 0) params.set('ingredients', ingredients.join(','));
      if (diet === 'vegetarian') params.set('diet', 'vegetarian');
      else if (diet === 'vegan') params.set('diet', 'vegan');

      const res = await fetch(`/api/recipes?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch recipes');
      setRecipes(data.results ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, cuisine, diet, ingredients]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIngredients([]);
  };

  const handleAnalyzed = (found) => {
    setIngredients(found);
    setShowUpload(false);
    setCameraFile(null);
  };

  const handleCameraCapture = (file) => {
    setShowCamera(false);
    setCameraFile(file);
    setShowUpload(true);
  };

  return (
    <main className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
            <line x1="6" y1="17" x2="18" y2="17" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight">Recipe Home</h1>
        </div>
      </header>

      {/* Tabs */}
      <TabNav active={activeTab} onChange={handleTabChange} />

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-5 pb-2">
        <div className="flex flex-wrap items-center gap-3">
          {/* Popularity */}
          <button
            onClick={() => setIngredients([])}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium text-sm transition-colors ${
              ingredients.length === 0
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Popular
          </button>

          {/* Find by Ingredients */}
          <button
            onClick={() => { setCameraFile(null); setShowUpload(true); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium text-sm transition-colors ${
              ingredients.length > 0
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Find by Ingredients
          </button>

          {/* Take Photo */}
          <button
            onClick={() => setShowCamera(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-300 bg-white text-gray-700 font-medium text-sm cursor-pointer hover:border-orange-400 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Take Photo
          </button>

          {/* Cuisine */}
          <CuisineFilter value={cuisine} onChange={setCuisine} />
        </div>

        {/* Diet Filter */}
        <div className="mt-3">
          <DietFilter value={diet} onChange={setDiet} />
        </div>

        {/* Active ingredient chips */}
        {ingredients.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Ingredients detected:
            </span>
            {ingredients.map((ing) => (
              <span
                key={ing}
                className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {ing}
              </span>
            ))}
            <button
              onClick={() => setIngredients([])}
              className="text-xs text-red-400 hover:text-red-600 ml-1 underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Image Upload Modal */}
      {showUpload && (
        <ImageUpload
          initialFile={cameraFile}
          onAnalyzed={handleAnalyzed}
          onClose={() => { setShowUpload(false); setCameraFile(null); }}
        />
      )}

      {/* Recipe Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12 pt-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-500 font-medium">{error}</p>
            <p className="text-gray-400 text-sm mt-2">
              Make sure <code className="bg-gray-100 px-1 rounded">SPOONACULAR_API_KEY</code> is set in{' '}
              <code className="bg-gray-100 px-1 rounded">.env.local</code>
            </p>
            <button
              onClick={fetchRecipes}
              className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600"
            >
              Retry
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-gray-500">No recipes found. Try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
