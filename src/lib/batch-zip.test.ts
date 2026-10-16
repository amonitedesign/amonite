import { describe, expect, it } from 'vitest';
import {
  computeCRC32,
  createZipArchive,
  buildEtsyVariations,
  generateEtsyListingGuide,
} from './batch-zip';
import { VESSEL_ARCHETYPES } from './vessel-geometry';

describe('batch-zip / etsy collection drop pack', () => {
  it('computes CRC32 accurately according to IEEE 802.3', () => {
    const text = new TextEncoder().encode('123456789');
    expect(computeCRC32(text)).toBe(0xcbf43926);
  });

  it('builds a standard ZIP archive with PK local, central, and end-of-directory records', async () => {
    const files = [
      { name: 'hello.txt', data: 'Hello Amonite Atelier' },
      { name: 'test.bin', data: new Uint8Array([1, 2, 3, 4, 5]) },
    ];
    const blob = createZipArchive(files);
    expect(blob.type).toBe('application/zip');
    expect(blob.size).toBeGreaterThan(100);

    const buf = await blob.arrayBuffer();
    const dv = new DataView(buf);
    // Local File Header Signature 0x04034b50
    expect(dv.getUint32(0, true)).toBe(0x04034b50);
  });

  it('builds 6 commercial variations from base vessel parameters', () => {
    const base = VESSEL_ARCHETYPES['fluted-vase'].defaults;
    const variations = buildEtsyVariations(base);

    expect(variations).toHaveLength(6);
    expect(variations.map((v) => v.id)).toEqual([
      '01-tall-classic',
      '02-petite-catchall',
      '03-wide-statement',
      '04-architectural-fluted',
      '05-helical-twist',
      '06-kiln-compensated',
    ]);

    // Tall variation is taller than base
    expect(variations[0].params.height).toBeGreaterThan(base.height);
    // Petite variation is shorter than base
    expect(variations[1].params.height).toBeLessThan(base.height);
    // Kiln variation has positive shrinkagePercent
    expect(variations[5].params.shrinkagePercent).toBeGreaterThan(0);
  });

  it('generates an Etsy listing guide containing SEO tags and kiln compensation', () => {
    const base = { ...VESSEL_ARCHETYPES['fluted-vase'].defaults, shrinkagePercent: 11.8 };
    const guide = generateEtsyListingGuide(base);

    expect(guide).toContain('AMONITE ATELIER');
    expect(guide).toContain('01-Tall-Classic-fluted-vase.stl');
    expect(guide).toContain('minimalist vase');
    expect(guide).toContain('+11.8%');
    expect(guide).toContain('Vase Mode');
  });
});
