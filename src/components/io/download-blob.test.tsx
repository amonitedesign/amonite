import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import FileDialog from './file-dialog';
import * as projectIo from '@/lib/parsers/project-io';
import { useCADStore } from '@/store/cad-store';

function seed() {
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
    undoStack: [],
    redoStack: [],
  } as never);
}

describe('downloadBlob (jsdom)', () => {
  it('triggers an anchor download and revokes the URL', async () => {
    seed();
    const create = vi.fn(() => 'blob:fake');
    const revoke = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: create, revokeObjectURL: revoke });
    const download = vi.spyOn(projectIo, 'downloadBlob');

    const { getByText } = render(<FileDialog isOpen onClose={() => {}} />);
    (getByText('Amonite JSON') as HTMLElement).closest('button')!.click();

    expect(download).toHaveBeenCalled();
    expect(create).toHaveBeenCalled();
    expect(revoke).toHaveBeenCalledWith('blob:fake');
  });
});
