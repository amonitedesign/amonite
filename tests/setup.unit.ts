// Tier 1 (unit / node) setup — deterministic IDs + Blob sanity.
import { beforeEach, vi } from 'vitest';

let nowCounter = 1700000000000;
beforeEach(() => {
  nowCounter += 1;
  // Increment on every call so rapid addNode() calls get unique ids,
  // mirroring real clock behaviour (see collision test with frozen clock).
  vi.spyOn(Date, 'now').mockImplementation(() => {
    nowCounter += 1;
    return nowCounter;
  });
});

if (typeof Blob === 'undefined') {
  throw new Error('Blob is required for parser tests (Node 18+ provides it).');
}
