import { describe, expect, it, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import StudioSettings from './studio-settings';
import { useCADStore } from '@/store/cad-store';
import { DEFAULT_STUDIO_SETTINGS } from '@/lib/cad-types';

function resetStore() {
  useCADStore.setState({
    nodes: [],
    vesselId: null,
    undoStack: [],
    redoStack: [],
    settings: { ...DEFAULT_STUDIO_SETTINGS },
  } as never);
  localStorage.clear();
}

describe('studio-settings / popover', () => {
  beforeEach(resetStore);

  it('opens from the gear button and shows grouped sections', () => {
    render(<StudioSettings />);
    fireEvent.click(screen.getByLabelText('Studio settings'));
    expect(screen.getByRole('dialog', { name: 'Studio settings' })).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Turntable & stage')).toBeInTheDocument();
    expect(screen.getByText('Units')).toBeInTheDocument();
    expect(screen.getByText('Workshop')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('toggles the studio theme and persists it', () => {
    render(<StudioSettings />);
    fireEvent.click(screen.getByLabelText('Studio settings'));
    fireEvent.click(screen.getByText('Light paper'));
    expect(useCADStore.getState().settings.theme).toBe('light');
    expect(JSON.parse(localStorage.getItem('amonite-studio-settings')!).theme).toBe('light');
    fireEvent.click(screen.getByText('Dark atelier'));
    expect(useCADStore.getState().settings.theme).toBe('dark');
  });

  it('toggles turntable + stage switches', () => {
    render(<StudioSettings />);
    fireEvent.click(screen.getByLabelText('Studio settings'));
    const turntable = screen.getByRole('switch', { name: /Turntable rotation/ });
    expect(turntable).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(turntable);
    expect(useCADStore.getState().settings.autoRotate).toBe(false);
    const pedestal = screen.getByRole('switch', { name: /Display pedestal/ });
    fireEvent.click(pedestal);
    expect(useCADStore.getState().settings.pedestalVisible).toBe(false);
  });

  it('switches display units', () => {
    render(<StudioSettings />);
    fireEvent.click(screen.getByLabelText('Studio settings'));
    fireEvent.click(screen.getByText('Inches'));
    expect(useCADStore.getState().viewport.unit).toBe('in');
  });

  it('closes on Escape', () => {
    render(<StudioSettings />);
    fireEvent.click(screen.getByLabelText('Studio settings'));
    expect(screen.getByRole('dialog', { name: 'Studio settings' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Studio settings' })).not.toBeInTheDocument();
  });
});
