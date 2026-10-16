import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import PricingTiles from './pricing-tiles';

describe('pricing-tiles / cascading tiers', () => {
  it('renders all three tiers with names and taglines', () => {
    render(<PricingTiles period="annual" onSelectPlan={() => {}} />);
    expect(screen.getByTestId('tier-free')).toBeInTheDocument();
    expect(screen.getByTestId('tier-pro')).toBeInTheDocument();
    expect(screen.getByTestId('tier-studio')).toBeInTheDocument();
    expect(screen.getByText('Most popular')).toBeInTheDocument();
  });

  it('shows annual prices with billing note', () => {
    render(<PricingTiles period="annual" onSelectPlan={() => {}} />);
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$16')).toBeInTheDocument();
    expect(screen.getByText('$24')).toBeInTheDocument();
    expect(screen.getAllByText(/billed annually/).length).toBeGreaterThan(0);
  });

  it('shows monthly prices without the annual note', () => {
    render(<PricingTiles period="monthly" onSelectPlan={() => {}} />);
    expect(screen.getByText('$20')).toBeInTheDocument();
    expect(screen.getByText('$30')).toBeInTheDocument();
    expect(screen.queryByText(/billed annually/)).toBeNull();
  });

  it('free tile links to the sandbox, paid tiles call back with plan', () => {
    const onSelectPlan = vi.fn();
    render(<PricingTiles period="annual" onSelectPlan={onSelectPlan} />);
    const sandboxLink = screen.getByText('Open sandbox').closest('a');
    expect(sandboxLink?.getAttribute('href')).toBe('/sandbox');
    fireEvent.click(screen.getByText('Notify me'));
    expect(onSelectPlan).toHaveBeenCalledWith('pro');
    fireEvent.click(screen.getByText('Talk to us'));
    expect(onSelectPlan).toHaveBeenCalledWith('studio');
  });

  it('marks paid tiers as coming-soon, not checkout', () => {
    render(<PricingTiles period="annual" onSelectPlan={() => {}} />);
    expect(screen.getAllByText(/Coming soon/).length).toBe(2);
    expect(screen.queryByText(/card number|checkout|pay now/i)).toBeNull();
  });
});
