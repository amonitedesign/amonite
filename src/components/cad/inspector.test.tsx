import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import CADInspector from './cad-inspector';
import { useCADStore } from '@/store/cad-store';
import type { CADNode } from '@/lib/cad-types';

const box: CADNode = {
  id: 'b1',
  name: 'Base Plate',
  type: 'box',
  position: { x: 10, y: 20, z: 30 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  dimensions: { width: 61, height: 11, depth: 71 },
  color: '#38bdf8',
  visible: true,
  wireframe: false,
};

function seed(node: CADNode | null) {
  useCADStore.setState({
    nodes: node ? [node] : [],
    selectedId: node ? node.id : null,
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

describe('cad-inspector', () => {
  it('shows empty state with no selection', () => {
    seed(null);
    render(<CADInspector />);
    expect(screen.getByText(/No object selected/)).toBeInTheDocument();
  });

  it('displays position converted to active unit (mm)', () => {
    seed(box);
    const { container } = render(<CADInspector />);
    const inputs = container.querySelectorAll('input[type="number"]');
    // first three number inputs are X/Y/Z position
    expect((inputs[0] as HTMLInputElement).value).toBe('10');
    expect((inputs[1] as HTMLInputElement).value).toBe('20');
    expect((inputs[2] as HTMLInputElement).value).toBe('30');
  });

  it('converts position display to inches when unit is in', () => {
    seed(box);
    useCADStore.setState({ viewport: { ...useCADStore.getState().viewport, unit: 'in' } });
    const { container } = render(<CADInspector />);
    const inputs = container.querySelectorAll('input[type="number"]');
    expect((inputs[0] as HTMLInputElement).value).toBe((10 / 25.4).toFixed(3));
  });

  it('clamps dimension edits to minimum 1', () => {
    seed(box);
    const { container } = render(<CADInspector />);
    // box dims are unique in the seed (61/11/71); Width input edits dimensions.width
    const width = screen.getByDisplayValue('61');
    fireEvent.change(width, { target: { value: '-5' } });
    expect(useCADStore.getState().nodes[0].dimensions.width).toBe(1);
    void container;
  });

  it('toggles node visibility via eye button', () => {
    seed(box);
    const { container } = render(<CADInspector />);
    fireEvent.click(container.querySelector('button[title="Toggle Visibility"]')!);
    expect(useCADStore.getState().nodes[0].visible).toBe(false);
  });

  it('renames the node', () => {
    seed(box);
    render(<CADInspector />);
    fireEvent.change(screen.getByDisplayValue('Base Plate'), {
      target: { value: 'Top Cover' },
    });
    expect(useCADStore.getState().nodes[0].name).toBe('Top Cover');
  });
});
