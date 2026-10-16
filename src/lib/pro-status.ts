'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Client-only Pro entitlement hook (public-repo safe).
 *
 * Source priority:
 *   1. `ProStatusProvider` override — the injection point for the private
 *      vault. When billing goes live there, the private host wraps the app
 *      in `<ProStatusProvider isPro={serverVerified}>` and this repo renders
 *      paid UI with zero payment/auth/DB code of its own (segregation guard).
 *   2. `localStorage` preview flag (`amonite_pro_preview === '1'`) —
 *      demo-grade and spoofable; exists so the Pro badge UI can be
 *      previewed/tested until the vault ships. Never treat as proof of payment.
 *   3. `false` (free tier) by default.
 */

export const PRO_PREVIEW_KEY = 'amonite_pro_preview';

const ProStatusContext = createContext<{ isPro: boolean } | null>(null);

export function ProStatusProvider({
  isPro,
  children,
}: {
  isPro: boolean;
  children: React.ReactNode;
}) {
  return React.createElement(ProStatusContext.Provider, { value: { isPro } }, children);
}

export function readProPreview(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(PRO_PREVIEW_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeProPreview(isPro: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (isPro) window.localStorage.setItem(PRO_PREVIEW_KEY, '1');
    else window.localStorage.removeItem(PRO_PREVIEW_KEY);
  } catch {
    // Ignore restricted storage contexts
  }
}

export function useProStatus(): { isPro: boolean } {
  const injected = useContext(ProStatusContext);
  const [preview, setPreview] = useState<boolean>(() => readProPreview());

  useEffect(() => {
    if (injected) return;
    const sync = () => setPreview(readProPreview());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [injected]);

  if (injected) return injected;
  return { isPro: preview };
}
