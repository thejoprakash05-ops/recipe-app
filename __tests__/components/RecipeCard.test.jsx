import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RecipeCard from '@/components/RecipeCard';

vi.mock('next/link', () => ({
  default: ({ href, children }) => <a href={href}>{children}</a>,
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, fill, sizes, priority, onError, ...rest }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={onError} {...rest} />,
}));

const baseRecipe = {
  id: 42,
  title: 'Chocolate Lava Cake',
  image: 'https://img.spoonacular.com/recipes/42-312x231.jpg',
  readyInMinutes: 30,
  spoonacularScore: 80,
  cuisines: ['French'],
  extendedIngredients: new Array(10).fill({}),
};

describe('RecipeCard', () => {
  it('renders the recipe title', () => {
    render(<RecipeCard recipe={baseRecipe} />);
    expect(screen.getByText('Chocolate Lava Cake')).toBeInTheDocument();
  });

  it('links to the correct recipe detail URL', () => {
    render(<RecipeCard recipe={baseRecipe} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/recipe/42');
  });

  it('displays cook time', () => {
    render(<RecipeCard recipe={baseRecipe} />);
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('shows the cuisine label', () => {
    render(<RecipeCard recipe={baseRecipe} />);
    expect(screen.getByText('French')).toBeInTheDocument();
  });

  it('shows Medium skill for a 30-min 10-ingredient recipe', () => {
    render(<RecipeCard recipe={baseRecipe} />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('shows Easy for a short recipe with few ingredients', () => {
    render(<RecipeCard recipe={{ ...baseRecipe, readyInMinutes: 15, extendedIngredients: new Array(5).fill({}) }} />);
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('shows Hard for a long recipe with many ingredients', () => {
    render(<RecipeCard recipe={{ ...baseRecipe, readyInMinutes: 90, extendedIngredients: new Array(20).fill({}) }} />);
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  // Regression: placeholder shown when recipe.image is missing
  it('regression — uses placeholder SVG when recipe has no image', () => {
    render(<RecipeCard recipe={{ ...baseRecipe, image: undefined }} />);
    const img = screen.getByAltText('Chocolate Lava Cake');
    expect(img).toHaveAttribute('src', '/recipe-placeholder.svg');
  });

  // Regression: placeholder shown when image fails to load
  it('regression — falls back to placeholder on image load error', () => {
    render(<RecipeCard recipe={baseRecipe} />);
    const img = screen.getByAltText('Chocolate Lava Cake');
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', '/recipe-placeholder.svg');
  });

  it('renders star score when spoonacularScore is present', () => {
    render(<RecipeCard recipe={baseRecipe} />);
    expect(screen.getByText('4.0')).toBeInTheDocument();
  });

  it('does not render star score when spoonacularScore is 0', () => {
    render(<RecipeCard recipe={{ ...baseRecipe, spoonacularScore: 0 }} />);
    expect(screen.queryByText(/\d\.\d/)).not.toBeInTheDocument();
  });
});
