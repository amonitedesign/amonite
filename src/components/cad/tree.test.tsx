import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import CADTree from './cad-tree';
import { useCADStore } from '@/store/cad-store';
import type { CADNode } from '@/lib/cad-types';

function seed() {
  const mk = (id: string, name: string, type: CADNode['type']): CADNode => ({
    id,
    name,
    type,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    dimensions: {},
    color: '#fff',
    visible: true,
    wireframe: false,
  });
  useCADStore.setState({
    nodes: [mk('a', 'Base Plate', 'box'), mk('b', 'Boss', 'cylinder')],
    selectedId: 'a',
  } as never);
}

describe('cad-tree', () => {
  it('shows node count and names', () => {
    seed();
    render(<CADTree />);
    expect(screen.getByText('Base Plate')).toBeInTheDocument();
    expect(screen.getByText('Boss')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('selects a node on row click', () => {
    seed();
    render(<CADTree />);
    fireEvent.click(screen.getByText('Boss'));
    expect(useCADStore.getState().selectedId).toBe('b');
  });

  it('toggles visibility without changing selection (stopPropagation)', () => {
    seed();
    const { container } = render(<CADTree />);
    const buttons = container.querySelectorAll('button');
    // first row: eye button is the first button in the row
    fireEvent.click(buttons[0]);
    expect(useCADStore.getState().nodes[0].visible).toBe(false);
    expect(useCADStore.getState().selectedId).toBe('a');
  });

  it('deletes a node via trash button', () => {
    seed();
    const { container } = render(<CADTree />);
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[1]); // trash of first row
    expect(useCADStore.getState().nodes).toHaveLength(1);
  });

  it('shows empty state when scene is empty', () => {
    useCADStore.setState({ nodes: [], selectedId: null } as never);
    render(<CADTree />);
    expect(screen.getByText('No objects in scene.')).toBeInTheDocument();
  });
});
