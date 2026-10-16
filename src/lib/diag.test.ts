import { it } from 'vitest';
import { createVesselGeometry, VESSEL_ARCHETYPES } from './vessel-geometry';
import { verifyVesselGeometry } from './mesh-verify';

it('diag prints per-archetype checks', () => {
  for (const key of Object.keys(VESSEL_ARCHETYPES)) {
    const preset = VESSEL_ARCHETYPES[key as keyof typeof VESSEL_ARCHETYPES].defaults;
    const geom = createVesselGeometry(preset);
    const r = verifyVesselGeometry(geom, {
      baseTop: preset.wallThickness,
      height: preset.height,
      expectedLoops: 2,
    });
    console.log(
      key,
      'tris=' + r.triangleCount,
      r.checks.map((c) => `${c.id}:${c.pass ? 'ok' : 'FAIL(' + c.detail + ')'}`).join(' ')
    );
  }
});
