import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DesignerShowcase from './designer-showcase';

describe('designer-showcase / interior decor gallery', () => {
  it('renders section header and all 4 archetype tabs', () => {
    render(<DesignerShowcase />);
    expect(screen.getByText('Curated objects crafted in Amonite')).toBeInTheDocument();
    expect(screen.getByText(/02 \/\/ DESIGNER WORK SHOWCASE/)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Fluted Ikebana Vessel/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ribbed Nordic Planter/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pleated Wave Bowl/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Twisted Biophilic Lamp Shell/ })).toBeInTheDocument();
  });

  it('displays initial default archetype (Fluted Vase) specifications', () => {
    render(<DesignerShowcase />);
    expect(screen.getByText('210 mm')).toBeInTheDocument();
    expect(screen.getByText('1h 48m')).toBeInTheDocument();
    expect(screen.getByText('+12.0% Kiln Factor')).toBeInTheDocument();
    expect(screen.getByText(/Japanese ceremonial ikebana ceramics/)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Customize in Studio/ });
    expect(link).toHaveAttribute('href', '/sandbox?archetype=fluted-vase');
  });

  it('switches to Ribbed Nordic Planter and updates fabrication specs', () => {
    render(<DesignerShowcase />);
    const planterTab = screen.getByRole('button', { name: /Ribbed Nordic Planter/ });
    fireEvent.click(planterTab);

    expect(screen.getByText('140 mm')).toBeInTheDocument();
    expect(screen.getByText('3h 15m')).toBeInTheDocument();
    expect(screen.getByText('+10.5% Kiln Factor')).toBeInTheDocument();
    expect(screen.getByText(/stepped horizontal ribbing provides structural rigidity/)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Customize in Studio/ });
    expect(link).toHaveAttribute('href', '/sandbox?archetype=ribbed-planter');
  });

  it('switches to Twisted Biophilic Lamp Shell with vase mode telemetry', () => {
    render(<DesignerShowcase />);
    const lampTab = screen.getByRole('button', { name: /Twisted Biophilic Lamp Shell/ });
    fireEvent.click(lampTab);

    expect(screen.getByText('260 mm')).toBeInTheDocument();
    expect(screen.getByText('2h 40m')).toBeInTheDocument();
    expect(screen.getByText('0.0% (Polymer)')).toBeInTheDocument();
    expect(screen.getByText(/diffuses the interior light source into soft ambient gradients/)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Customize in Studio/ });
    expect(link).toHaveAttribute('href', '/sandbox?archetype=twisted-lamp');
  });

  it('switches to Pleated Wave Bowl and verifies porcelain specs', () => {
    render(<DesignerShowcase />);
    const bowlTab = screen.getByRole('button', { name: /Pleated Wave Bowl/ });
    fireEvent.click(bowlTab);

    expect(screen.getByText('85 mm')).toBeInTheDocument();
    expect(screen.getByText('2h 05m')).toBeInTheDocument();
    expect(screen.getByText('+14.2% Kiln Factor')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Customize in Studio/ });
    expect(link).toHaveAttribute('href', '/sandbox?archetype=organic-bowl');
  });
});
