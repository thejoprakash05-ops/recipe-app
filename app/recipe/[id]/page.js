import { notFound } from 'next/navigation';
import RecipeDetail from '@/components/RecipeDetail';

async function getRecipe(id) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  return { title: recipe?.title ?? 'Recipe' };
}

export default async function RecipePage({ params }) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();
  return <RecipeDetail recipe={recipe} />;
}
