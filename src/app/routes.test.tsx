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
    expect(screen.getByText(/Sculpt minimal 3D objects/)).toBeInTheDocument();
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

  it('sandbox renders studio shell with toolbar + tree + inspector', () => {
    resetStore();
    render(<SandboxPage />);
    expect(screen.getByText('AMONITE // STUDIO')).toBeInTheDocument();
    expect(screen.getByText('Import / Export')).toBeInTheDocument();
    expect(screen.getByText('Scene Hierarchy')).toBeInTheDocument();
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
  });

  it('sandbox hotkeys drive transform modes (G/R/S/V)', () => {
    resetStore();
    render(<SandboxPage />);
    act(() => {
      fireEvent.keyDown(window, { key: 'g' });
    });
    expect(useCADStore.getState().transformMode).toBe('translate');
    act(() => {
      fireEvent.keyDown(window, { key: 'r' });
    });
    expect(useCADStore.getState().transformMode).toBe('rotate');
    act(() => {
      fireEvent.keyDown(window, { key: 's' });
    });
    expect(useCADStore.getState().transformMode).toBe('scale');
    act(() => {
      fireEvent.keyDown(window, { key: 'v' });
    });
    expect(useCADStore.getState().transformMode).toBe('select');
  });

  it('sandbox hotkeys toggle calipers (M) and clear on Escape', () => {
    resetStore();
    render(<SandboxPage />);
    act(() => {
      fireEvent.keyDown(window, { key: 'm' });
    });
    expect(useCADStore.getState().measureActive).toBe(true);
    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });
    expect(useCADStore.getState().measureActive).toBe(false);
  });

  it('sandbox Ctrl+D duplicates and Delete removes the selection', () => {
    resetStore();
    render(<SandboxPage />);
    let added!: { id: string };
    act(() => {
      added = useCADStore.getState().addNode('box');
    });
    expect(useCADStore.getState().nodes).toHaveLength(1);
    act(() => {
      fireEvent.keyDown(window, { key: 'd', ctrlKey: true });
    });
    expect(useCADStore.getState().nodes).toHaveLength(2);
    act(() => {
      useCADStore.setState({ selectedId: added.id });
    });
    act(() => {
      fireEvent.keyDown(window, { key: 'Delete' });
    });
    expect(useCADStore.getState().nodes.find((n) => n.id === added.id)).toBeUndefined();
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
    fireEvent.click(screen.getByText('Do my clients need a paid seat to view a room?'));
    expect(screen.getByText(/Viewers are free on every tier/)).toBeInTheDocument();
  });
});
