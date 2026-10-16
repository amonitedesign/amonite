'use client';

import React from 'react';

/**
 * Non-clickable Pro status chip shown in place of "Get Pro" for paid users.
 * Tone comes from the caller so it can sit on light (navbar) or dark
 * (sandbox) surfaces; the terracotta dot is the shared brand signal.
 */
export default function ProBadge({ className = '' }: { className?: string }) {
  return (
    <span
      data-testid="pro-badge"
      aria-label="Pro plan active"
      title="Pro plan active"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#c96f4b]" aria-hidden="true" />
      <span>PRO</span>
    </span>
  );
}
