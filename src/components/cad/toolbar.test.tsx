import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import CADToolbar from './cad-toolbar';
import { useCADStore } from '@/store/cad-store';

function reset() {
  useCADStore.setState({
    nodes: [],
    selectedId: null,
    transformMode: 'select',
    undoStack: [],
    redoStack: [],
  } as never);
}

describe('cad-toolbar', () => {
  it('renders transform modes and primitive buttons', () => {
    reset();
    render(<CADToolbar />);
    expect(screen.getByTitle('Select (V)')).toBeInTheDocument();
    expect(screen.getByTitle('Move (G)')).toBeInTheDocument();
    expect(screen.getByTitle('Rotate (R)')).toBeInTheDocument();
    expect(screen.getByTitle('Scale (S)')).toBeInTheDocument();
    expect(screen.getByTitle('Add Cuboid')).toBeInTheDocument();
    expect(screen.getByTitle('Add Cylinder')).toBeInTheDocument();
  });

  it('switches transform mode on click', () => {
    reset();
    render(<CADToolbar />);
    fireEvent.click(screen.getByTitle('Move (G)'));
    expect(useCADStore.getState().transformMode).toBe('translate');
  });

  it('adds a primitive node on click', () => {
    reset();
    render(<CADToolbar />);
    fireEvent.click(screen.getByTitle('Add Cuboid'));
    const st = useCADStore.getState();
    expect(st.nodes).toHaveLength(1);
    expect(st.nodes[0].type).toBe('box');
    expect(st.selectedId).toBe(st.nodes[0].id);
  });

  it('disables undo/redo when stacks are empty, enables after add', () => {
    reset();
    const { rerender } = render(<CADToolbar />);
    expect(screen.getByTitle('Undo (Ctrl+Z)')).toBeDisabled();
    expect(screen.getByTitle('Redo (Ctrl+Y)')).toBeDisabled();
    fireEvent.click(screen.getByTitle('Add Cuboid'));
    rerender(<CADToolbar />);
    expect(screen.getByTitle('Undo (Ctrl+Z)')).not.toBeDisabled();
  });

  it('shows duplicate/delete only when a node is selected', () => {
    reset();
    const { rerender } = render(<CADToolbar />);
    expect(screen.queryByTitle('Duplicate (Ctrl+D)')).toBeNull();
    fireEvent.click(screen.getByTitle('Add Cuboid'));
    rerender(<CADToolbar />);
    expect(screen.getByTitle('Duplicate (Ctrl+D)')).toBeInTheDocument();
    expect(screen.getByTitle('Delete (Del)')).toBeInTheDocument();
  });

  it('deletes the selected node', () => {
    reset();
    render(<CADToolbar />);
    fireEvent.click(screen.getByTitle('Add Cuboid'));
    const id = useCADStore.getState().selectedId!;
    fireEvent.click(screen.getByTitle('Delete (Del)'));
    expect(useCADStore.getState().nodes.find((n) => n.id === id)).toBeUndefined();
  });

  it('undoes the last add', () => {
    reset();
    render(<CADToolbar />);
    fireEvent.click(screen.getByTitle('Add Cuboid'));
    expect(useCADStore.getState().nodes).toHaveLength(1);
    fireEvent.click(screen.getByTitle('Undo (Ctrl+Z)'));
    expect(useCADStore.getState().nodes).toHaveLength(0);
  });
});
