'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

function getSkillLevel(recipe) {
  const time = recipe.readyInMinutes || 30;
  const ingredients = recipe.extendedIngredients?.length || 10;
  if (time <= 25 && ingredients <= 8)
    return { label: 'Easy', color: 'bg-green-100 text-green-700' };
  if (time <= 55 && ingredients <= 16)
    return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
  return { label: 'Hard', color: 'bg-red-100 text-red-700' };
}

function StarScore({ score }) {
  const stars = Math.round((score / 100) * 5 * 2) / 2;
  return (
    <div className="flex items-center gap-1">
      <svg className="w-3 h-3 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="text-xs font-semibold text-gray-700">{stars.toFixed(1)}</span>
    </div>
  );
}

export default function RecipeCard({ recipe }) {
  const skill = getSkillLevel(recipe);
  const score = recipe.spoonacularScore || 0;
  const time = recipe.readyInMinutes;
  const cuisine = recipe.cuisines?.[0];
  const [imgSrc, setImgSrc] = useState(recipe.image || '/recipe-placeholder.svg');

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer group h-full flex flex-col">
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <Image
            src={imgSrc}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgSrc('/recipe-placeholder.svg')}
          />
          {score > 0 && (
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
              <StarScore score={score} />
            </div>
          )}
          {cuisine && (
            <div className="absolute top-2 left-2 bg-orange-500/90 text-white text-xs px-2 py-1 rounded-full font-medium">
              {cuisine}
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-3 group-hover:text-orange-600 transition-colors flex-1">
            {recipe.title}
          </h3>
          <div className="flex items-center justify-between">
            {time && (
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{time} min</span>
              </div>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${skill.color}`}>
              {skill.label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
