import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import DynamicHeroHeadline from './dynamic-hero-headline';

describe('dynamic-hero-headline', () => {
  it('renders the accessible headline text for screen readers and SEO', () => {
    render(<DynamicHeroHeadline />);
    expect(
      screen.getByText('Sculpt bespoke minimal vases & interior decor, right in your browser.')
    ).toBeInTheDocument();
  });

  it('renders the visual dynamic typing wrapper', () => {
    const { container } = render(<DynamicHeroHeadline />);
    const heading = container.querySelector('h1');
    expect(heading).toBeInTheDocument();
    expect(heading?.textContent).toContain('Sculpt bespoke minimal');
    expect(heading?.textContent).toContain(', right in your browser.');
  });
});
