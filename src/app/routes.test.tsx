import { describe, expect, it, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';

vi.mock('@/components/cad/cad-canvas', () => ({
  default: () => <canvas data-testid="mock-canvas" />,
}));

import LandingPage from '@/app/page';
import DocsPage from '@/app/docs/page';
import SandboxPage from '@/app/sandbox/page';
import PricingPage from '@/app/pricing/page';
import { useCADStore } from '@/store/cad-store';

function resetStore() {
  useCADStore.setState({
    nodes: [],
    selectedId: null,
    transformMode: 'select',
    undoStack: [],
    redoStack: [],
    measureActive: false,
    measurePoints: null,
    viewport: {
      cameraMode: 'perspective',
      renderStyle: 'shaded',
      gridVisible: true,
      gridSize: 200,
      gridDivisions: 40,
      snapToGrid: true,
      snapStep: 5,
      unit: 'mm',
    },
  } as never);
  localStorage.clear();
}

describe('routes / primary smoke across the app', () => {
  it('landing renders hero + studio links without crashing', () => {
    resetStore();
    render(<LandingPage />);
    expect(screen.getByText(/Sculpt bespoke minimal vases/)).toBeInTheDocument();
    expect(screen.getAllByText('Open Studio Sandbox').length).toBeGreaterThan(0);
    expect(screen.queryByTestId('mock-canvas')).not.toBeInTheDocument();
  });

  it('docs renders shortcuts, units, and format specs', () => {
    resetStore();
    render(<DocsPage />);
    expect(screen.getByText('Amonite CAD Architecture & Reference')).toBeInTheDocument();
    expect(screen.getByText('Ctrl + Z')).toBeInTheDocument();
    expect(screen.getByText('Coordinate Frame & Units')).toBeInTheDocument();
    expect(screen.getByText(/\.STL — Stereolithography/)).toBeInTheDocument();
  });

  it('sandbox renders the atelier shell with archetypes + studio panel', () => {
    resetStore();
    render(<SandboxPage />);
    expect(screen.getByText('AMONITE ATELIER')).toBeInTheDocument();
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('Base forms')).toBeInTheDocument();
    expect(screen.getByText('Fluted Vase')).toBeInTheDocument();
    expect(screen.getByText('Shape the clay')).toBeInTheDocument();
    expect(screen.getByText('Reset view')).toBeInTheDocument();
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
  });

  it('sandbox archetype switch reconfigures the vessel', () => {
    resetStore();
    render(<SandboxPage />);
    fireEvent.click(screen.getByText('Organic Bowl'));
    const vessel = useCADStore.getState().nodes.find((n) => n.id === 'vessel-1')!;
    expect(vessel.vessel?.archetype).toBe('organic-bowl');
  });

  it('sandbox sliders reshape the vessel and undo restores it', () => {
    resetStore();
    render(<SandboxPage />);
    const slider = screen.getByLabelText('Base radius') as HTMLInputElement;
    fireEvent.pointerDown(slider);
    fireEvent.change(slider, { target: { value: '70' } });
    expect(
      useCADStore.getState().nodes.find((n) => n.id === 'vessel-1')!.vessel?.baseRadius
    ).toBe(70);
    act(() => {
      fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    });
    expect(
      useCADStore.getState().nodes.find((n) => n.id === 'vessel-1')!.vessel?.baseRadius
    ).toBe(45);
  });

  it('navbar splits Pro from Early Access: Get Pro + Pricing, no Join Waitlist', () => {
    resetStore();
    render(<LandingPage />);
    const proLink = screen.getByText('Get Pro').closest('a');
    expect(proLink?.getAttribute('href')).toBe('/pricing');
    const pricingLinks = screen
      .getAllByText('Pricing')
      .map((el) => el.closest('a')?.getAttribute('href'));
    expect(pricingLinks).toContain('/pricing');
    expect(screen.queryByText('Join Waitlist')).toBeNull();
    // Early Access still lives on the landing section
    expect(screen.getByText('Request Early Access')).toBeInTheDocument();
  });

  it('sandbox header links to pricing instead of opening waitlist', () => {
    resetStore();
    render(<SandboxPage />);
    const proLink = screen.getByText('Get Pro').closest('a');
    expect(proLink?.getAttribute('href')).toBe('/pricing');
    expect(screen.queryByText('Pro Early Access')).toBeNull();
  });

  it('pricing page renders hero, billing toggle, and three cascading tiles', () => {
    resetStore();
    render(<PricingPage />);
    expect(screen.getByText(/Free to plan\. Paid when you bill\./)).toBeInTheDocument();
    expect(screen.getByTestId('tier-free')).toBeInTheDocument();
    expect(screen.getByTestId('tier-pro')).toBeInTheDocument();
    expect(screen.getByTestId('tier-studio')).toBeInTheDocument();
    expect(screen.getByText('Most popular')).toBeInTheDocument();
  });

  it('pricing toggle switches monthly/annual prices', () => {
    resetStore();
    render(<PricingPage />);
    expect(screen.getByText('$16')).toBeInTheDocument(); // annual default
    fireEvent.click(screen.getByText(/Monthly/));
    expect(screen.getByText('$20')).toBeInTheDocument();
  });

  it('pricing Pro tile opens plan-tagged waitlist modal', () => {
    resetStore();
    render(<PricingPage />);
    fireEvent.click(screen.getByText('Notify me'));
    expect(screen.getByText('Queueing for Pro')).toBeInTheDocument();
  });

  it('pricing FAQ accordion expands answers', () => {
    resetStore();
    render(<PricingPage />);
    fireEvent.click(screen.getByText('Do my clients or studio viewers need a paid seat?'));
    expect(screen.getByText(/Viewers are free on every tier/)).toBeInTheDocument();
  });
});
