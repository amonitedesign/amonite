import { NextResponse } from 'next/server';

// Provider-neutral liveness probe. Any host (Node server, container,
// serverless, edge) can poll GET /api/health. No auth, no dependencies,
// no vendor SDKs — intentionally boring.
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'ok', v: 'fix-1101-v1' });
}
