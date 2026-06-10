import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TabNav from '@/components/TabNav';

describe('TabNav', () => {
  it('renders all three tabs', () => {
    render(<TabNav active="dessert" onChange={() => {}} />);
    expect(screen.getByText('Desserts')).toBeInTheDocument();
    expect(screen.getByText('Appetizers')).toBeInTheDocument();
    expect(screen.getByText('Main Course')).toBeInTheDocument();
  });

  it('active tab has orange border', () => {
    render(<TabNav active="dessert" onChange={() => {}} />);
    const activeBtn = screen.getByText('Desserts').closest('button');
    expect(activeBtn).toHaveClass('border-orange-500');
    expect(activeBtn).toHaveClass('text-orange-600');
  });

  it('inactive tabs have transparent border', () => {
    render(<TabNav active="dessert" onChange={() => {}} />);
    const inactiveBtn = screen.getByText('Appetizers').closest('button');
    expect(inactiveBtn).toHaveClass('border-transparent');
  });

  it('calls onChange with correct key when a tab is clicked', () => {
    const onChange = vi.fn();
    render(<TabNav active="dessert" onChange={onChange} />);
    fireEvent.click(screen.getByText('Main Course'));
    expect(onChange).toHaveBeenCalledWith('main course');
  });

  it('calls onChange with "appetizer" for Appetizers tab', () => {
    const onChange = vi.fn();
    render(<TabNav active="dessert" onChange={onChange} />);
    fireEvent.click(screen.getByText('Appetizers'));
    expect(onChange).toHaveBeenCalledWith('appetizer');
  });
});
