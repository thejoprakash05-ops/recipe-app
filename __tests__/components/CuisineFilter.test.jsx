import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CuisineFilter from '@/components/CuisineFilter';

describe('CuisineFilter', () => {
  it('shows "All Cuisines" as the default label', () => {
    render(<CuisineFilter value="All" onChange={() => {}} />);
    expect(screen.getByDisplayValue('All Cuisines')).toBeInTheDocument();
  });

  it('calls onChange with the selected cuisine value', () => {
    const onChange = vi.fn();
    render(<CuisineFilter value="All" onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Indian' } });
    expect(onChange).toHaveBeenCalledWith('Indian');
  });

  it('reflects the controlled value', () => {
    render(<CuisineFilter value="Italian" onChange={() => {}} />);
    expect(screen.getByDisplayValue('Italian')).toBeInTheDocument();
  });

  it('includes common cuisines in the option list', () => {
    render(<CuisineFilter value="All" onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    const optionValues = Array.from(select.options).map((o) => o.value);
    expect(optionValues).toContain('Indian');
    expect(optionValues).toContain('Italian');
    expect(optionValues).toContain('Japanese');
    expect(optionValues).toContain('Thai');
  });
});
