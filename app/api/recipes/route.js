import { cacheLife } from 'next/cache';

async function fetchSpoonacularRecipes(type, sort, cuisine, diet, ingredients) {
  'use cache';
  cacheLife('days');

  const apiKey = process.env.SPOONACULAR_API_KEY;
  const params = new URLSearchParams({
    apiKey,
    type,
    sort: ingredients ? 'min-missing-ingredients' : sort,
    sortDirection: 'desc',
    number: '12',
    addRecipeInformation: 'true',
    ...(cuisine && { cuisine }),
    ...(diet && { diet }),
    ...(ingredients && { includeIngredients: ingredients }),
  });

  const res = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?${params}`
  );
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || 'Spoonacular API error');
    err.status = res.status;
    throw err;
  }

  return data;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'main course';
  const sort = searchParams.get('sort') || 'popularity';
  const cuisine = searchParams.get('cuisine') || '';
  const diet = searchParams.get('diet') || '';
  const ingredients = searchParams.get('ingredients') || '';

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'SPOONACULAR_API_KEY not configured in .env.local', results: [] },
      { status: 500 }
    );
  }

  try {
    const data = await fetchSpoonacularRecipes(type, sort, cuisine, diet, ingredients);
    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: err.message, results: [] },
      { status: err.status || 500 }
    );
  }
}
