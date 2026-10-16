import { describe, expect, it } from 'vitest';
import { act, render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import CADMeasure from './cad-measure';
import { useCADStore } from '@/store/cad-store';

function reset() {
  useCADStore.setState({
    measureActive: true,
    measurePoints: null,
    cursorCoords: { x: 0, y: 0, z: 0 },
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
}

describe('cad-measure / calipers', () => {
  it('renders nothing when inactive', () => {
    useCADStore.setState({ measureActive: false } as never);
    const { container } = render(<CADMeasure />);
    expect(container).toBeEmptyDOMElement();
  });

  it('captures points A and B from cursor coords', () => {
    reset();
    render(<CADMeasure />);
    act(() => {
      useCADStore.setState({ cursorCoords: { x: 0, y: 0, z: 0 } });
    });
    fireEvent.click(screen.getByText('Set A'));
    act(() => {
      useCADStore.setState({ cursorCoords: { x: 3, y: 4, z: 0 } });
    });
    fireEvent.click(screen.getByText('Set B'));
    const pts = useCADStore.getState().measurePoints!;
    expect(pts.a).toEqual({ x: 0, y: 0, z: 0 });
    expect(pts.b).toEqual({ x: 3, y: 4, z: 0 });
  });

  it('reports distance 5.00 mm for a 3-4-5 triangle', () => {
    reset();
    useCADStore.setState({
      measurePoints: { a: { x: 0, y: 0, z: 0 }, b: { x: 3, y: 4, z: 0 } },
    });
    render(<CADMeasure />);
    expect(screen.getByText('5.00 mm')).toBeInTheDocument();
    expect(screen.getByText(/53.1°/)).toBeInTheDocument();
  });

  it('closes calipers on X button', () => {
    reset();
    render(<CADMeasure />);
    fireEvent.click(screen.getByTitle('Close calipers (Esc)'));
    expect(useCADStore.getState().measureActive).toBe(false);
    expect(useCADStore.getState().measurePoints).toBeNull();
  });
});
