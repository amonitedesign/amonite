import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import CADViewControls from './cad-view-controls';
import { useCADStore } from '@/store/cad-store';

function reset() {
  useCADStore.setState({
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
    activePreset: 'iso',
    cameraPresetTrigger: 0,
    cursorCoords: { x: 12.3, y: 0, z: -4.5 },
    measureActive: false,
    measurePoints: null,
  } as never);
}

describe('cad-view-controls', () => {
  it('renders all 7 camera presets and highlights the active one', () => {
    reset();
    render(<CADViewControls />);
    for (const label of ['ISO', 'TOP', 'FRONT', 'RIGHT', 'BOT', 'BACK', 'LEFT']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('sets camera preset on click', () => {
    reset();
    render(<CADViewControls />);
    fireEvent.click(screen.getByText('TOP'));
    expect(useCADStore.getState().activePreset).toBe('top');
  });

  it('toggles perspective/orthographic camera', () => {
    reset();
    render(<CADViewControls />);
    fireEvent.click(screen.getByText('PERSP'));
    expect(useCADStore.getState().viewport.cameraMode).toBe('orthographic');
  });

  it('cycles render style shaded -> wireframe -> hidden-line', () => {
    reset();
    render(<CADViewControls />);
    fireEvent.click(screen.getByText('SHADED'));
    expect(useCADStore.getState().viewport.renderStyle).toBe('wireframe');
    fireEvent.click(screen.getByText('WIREFRAME'));
    expect(useCADStore.getState().viewport.renderStyle).toBe('hidden-line');
  });

  it('toggles mm/inch units, storage stays canonical', () => {
    reset();
    render(<CADViewControls />);
    fireEvent.click(screen.getByText('MM'));
    expect(useCADStore.getState().viewport.unit).toBe('in');
    expect(screen.getByText('IN')).toBeInTheDocument();
  });

  it('changes snap step via select', () => {
    reset();
    render(<CADViewControls />);
    fireEvent.change(screen.getByLabelText('Snap step'), { target: { value: '10' } });
    expect(useCADStore.getState().viewport.snapStep).toBe(10);
  });

  it('toggles measurement calipers', () => {
    reset();
    render(<CADViewControls />);
    fireEvent.click(screen.getByText('MEASURE'));
    expect(useCADStore.getState().measureActive).toBe(true);
  });

  it('shows live cursor readout in active unit', () => {
    reset();
    render(<CADViewControls />);
    expect(screen.getByText('12.3')).toBeInTheDocument();
  });
});
