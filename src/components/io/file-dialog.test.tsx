import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import FileDialog from './file-dialog';
import { useCADStore } from '@/store/cad-store';

function reset() {
  useCADStore.setState({
    nodes: [
      {
        id: 'n1',
        name: 'Box',
        type: 'box',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        dimensions: { width: 10, height: 10, depth: 10 },
        color: '#fff',
        visible: true,
        wireframe: false,
      },
    ],
    selectedId: 'n1',
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
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:fake'),
    revokeObjectURL: vi.fn(),
  });
}

function uploadFile(ui: ReturnType<typeof render>, file: File) {
  const input = ui.container.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
}

describe('file-dialog / import-export hub', () => {
  it('renders nothing when closed', () => {
    reset();
    const { container } = render(<FileDialog isOpen={false} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('switches between export and import tabs', () => {
    reset();
    render(<FileDialog isOpen onClose={() => {}} />);
    expect(screen.getByText('STL Binary')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Import Files'));
    expect(screen.getByText(/Select or Drop/)).toBeInTheDocument();
  });

  it('imports a native JSON project and closes', async () => {
    reset();
    const onClose = vi.fn();
    const ui = render(<FileDialog isOpen onClose={onClose} />);
    fireEvent.click(screen.getByText('Import Files'));
    const project = JSON.stringify({
      version: '1.0.0',
      id: 'p',
      title: 'T',
      created: 1,
      updated: 2,
      viewport: useCADStore.getState().viewport,
      nodes: [{ ...useCADStore.getState().nodes[0], id: 'imported-1', name: 'Imported' }],
    });
    uploadFile(ui, new File([project], 'proj.amonite.json', { type: 'application/json' }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(useCADStore.getState().nodes[0].id).toBe('imported-1');
  });

  it('imports DXF vectors into an extrusion node', async () => {
    reset();
    const onClose = vi.fn();
    const ui = render(<FileDialog isOpen onClose={onClose} />);
    fireEvent.click(screen.getByText('Import Files'));
    const dxf = [
      '0', 'SECTION', '2', 'ENTITIES',
      '0', 'LINE', '10', '0', '20', '0', '30', '0', '11', '1', '21', '0', '31', '0',
      '0', 'LINE', '10', '10', '20', '0', '30', '0', '11', '10', '21', '10', '31', '0',
      '0', 'LINE', '10', '10', '20', '10', '30', '0', '11', '0', '21', '10', '31', '0',
      '0', 'LINE', '10', '0', '20', '10', '30', '0', '11', '0', '21', '0', '31', '0',
      '0', 'ENDSEC', '0', 'EOF',
    ].join('\n');
    uploadFile(ui, new File([dxf], 'shape.dxf'));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    const last = useCADStore.getState().nodes.at(-1)!;
    expect(last.type).toBe('extrusion');
    expect(last.extrusionPoints!.length).toBeGreaterThanOrEqual(3);
  });

  it('alerts on unsupported file format', async () => {
    reset();
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const ui = render(<FileDialog isOpen onClose={() => {}} />);
    fireEvent.click(screen.getByText('Import Files'));
    uploadFile(ui, new File(['x'], 'model.stl'));
    await waitFor(() => expect(alert).toHaveBeenCalledWith(expect.stringMatching(/Unsupported/)));
    alert.mockRestore();
  });

  it('alerts on corrupt JSON import', async () => {
    reset();
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const ui = render(<FileDialog isOpen onClose={() => {}} />);
    fireEvent.click(screen.getByText('Import Files'));
    uploadFile(ui, new File(['{{{'], 'bad.amonite.json'));
    await waitFor(() => expect(alert).toHaveBeenCalledWith(expect.stringMatching(/Failed to import/)));
    alert.mockRestore();
  });
});
