import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PRO_PREVIEW_KEY, readProPreview, writeProPreview } from './pro-status';

function stubStorage() {
  let store: Record<string, string> = {};
  const getItem = vi.fn((k: string) => (k in store ? store[k] : null));
  const setItem = vi.fn((k: string, v: string) => {
    store[k] = v;
  });
  const removeItem = vi.fn((k: string) => {
    delete store[k];
  });
  vi.stubGlobal('window', { localStorage: { getItem, setItem, removeItem } });
  return { getItem, setItem, removeItem, reset: () => (store = {}) };
}

describe('pro-status preview flag', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads false outside the browser (SSR guard)', () => {
    expect(readProPreview()).toBe(false);
    expect(() => writeProPreview(true)).not.toThrow();
  });

  it('round-trips the preview flag through localStorage', () => {
    const storage = stubStorage();
    expect(readProPreview()).toBe(false);
    writeProPreview(true);
    expect(storage.setItem).toHaveBeenCalledWith(PRO_PREVIEW_KEY, '1');
    expect(readProPreview()).toBe(true);
    writeProPreview(false);
    expect(storage.removeItem).toHaveBeenCalledWith(PRO_PREVIEW_KEY);
    expect(readProPreview()).toBe(false);
  });

  it('treats restricted storage as free tier instead of throwing', () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: () => {
          throw new Error('blocked');
        },
        setItem: () => {
          throw new Error('blocked');
        },
        removeItem: () => {
          throw new Error('blocked');
        },
      },
    });
    expect(readProPreview()).toBe(false);
    expect(() => writeProPreview(true)).not.toThrow();
  });
});
