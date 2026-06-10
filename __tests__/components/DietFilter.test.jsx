import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DietFilter from '@/components/DietFilter';

describe('DietFilter', () => {
  it('renders all four diet options', () => {
    render(<DietFilter value="all" onChange={() => {}} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Veg')).toBeInTheDocument();
    expect(screen.getByText('Vegan')).toBeInTheDocument();
    expect(screen.getByText('Non Veg')).toBeInTheDocument();
  });

  it('highlights the active button', () => {
    render(<DietFilter value="all" onChange={() => {}} />);
    expect(screen.getByText('All')).toHaveClass('bg-orange-600');
    expect(screen.getByText('Veg')).not.toHaveClass('bg-orange-600');
  });

  it('calls onChange with "vegetarian" when Veg is clicked', () => {
    const onChange = vi.fn();
    render(<DietFilter value="all" onChange={onChange} />);
    fireEvent.click(screen.getByText('Veg'));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('vegetarian');
  });

  it('calls onChange with "vegan" when Vegan is clicked', () => {
    const onChange = vi.fn();
    render(<DietFilter value="all" onChange={onChange} />);
    fireEvent.click(screen.getByText('Vegan'));
    expect(onChange).toHaveBeenCalledWith('vegan');
  });

  it('calls onChange with "non-veg" when Non Veg is clicked', () => {
    const onChange = vi.fn();
    render(<DietFilter value="all" onChange={onChange} />);
    fireEvent.click(screen.getByText('Non Veg'));
    expect(onChange).toHaveBeenCalledWith('non-veg');
  });

  // Regression: default diet must be 'vegetarian' (Veg button active)
  it('regression — vegetarian value activates the Veg button, not All', () => {
    render(<DietFilter value="vegetarian" onChange={() => {}} />);
    expect(screen.getByText('Veg')).toHaveClass('bg-orange-600');
    expect(screen.getByText('All')).not.toHaveClass('bg-orange-600');
    expect(screen.getByText('Vegan')).not.toHaveClass('bg-orange-600');
    expect(screen.getByText('Non Veg')).not.toHaveClass('bg-orange-600');
  });
});
