'use client';

import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PlanId } from '@/components/pricing/pricing-tiles';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: PlanId | null;
}

const PLAN_LABEL: Record<PlanId, string> = {
  free: 'Free',
  pro: 'Pro',
  studio: 'Studio',
};

export default function WaitlistModal({ isOpen, onClose, plan }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Interior Designer');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate direct queueing to amoniteadmin@gmail.com
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0c0d12] border border-zinc-200 dark:border-white/[0.08] rounded-xl shadow-2xl p-6 sm:p-7 font-mono text-zinc-900 dark:text-zinc-300 transition-colors">
        <button
          onClick={onClose}
          aria-label=""
          className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-zinc-400" />
              <span>EARLY ACCESS INTAKE</span>
            </div>

            <h3 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              Amonite Pro Early Access
            </h3>
            {plan && plan !== 'free' && (
              <div className="mt-2">
                <Badge variant="secondary">Queueing for {PLAN_LABEL[plan]}</Badge>
              </div>
            )}
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Queue for material libraries, joinery cut lists, and shareable
              client rooms. Direct interiors intake routed to{' '}
              <span className="text-zinc-900 dark:text-zinc-200 font-semibold">amoniteadmin@gmail.com</span>.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-semibold mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@studio.co"
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-[#12141c] border border-zinc-200 dark:border-white/10 rounded-lg text-xs text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-500 dark:focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-semibold mb-1.5">
                  Discipline
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#12141c] border border-zinc-200 dark:border-white/10 rounded-lg text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-500 dark:focus:border-white/30"
                >
                  <option value="Interior Designer">Interior Designer / Architect</option>
                  <option value="Cabinetmaker / Joiner">Cabinetmaker / Custom Joiner</option>
                  <option value="General Contractor">General Contractor / Builder</option>
                  <option value="Homeowner Planner">Homeowner / Self-Renovator</option>
                  <option value="Mechanical / CAM">Mechanical Engineer / CAM Specialist</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-zinc-500 pt-1">
                <Shield className="w-3.5 h-3.5 text-zinc-400" />
                <span>Zero spam. Direct review by Amonite team.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span>Request Early Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-800 dark:text-zinc-200 mx-auto">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>

            <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">
              You&apos;re on the list!
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
              We have queued <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{email}</span> for priority access
              {plan && plan !== 'free' && (
                <> to <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{PLAN_LABEL[plan]}</span></>
              )}
              . Invitations are dispatched on a rolling weekly basis.
            </p>

            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.04] hover:bg-zinc-100 dark:hover:bg-white/[0.08] text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors"
            >
              Back to Studio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
