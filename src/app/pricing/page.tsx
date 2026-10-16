'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/navbar';
import PricingTiles, { type BillingPeriod, type PlanId } from '@/components/pricing/pricing-tiles';
import WaitlistModal from '@/components/landing/waitlist-modal';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

const FAQS = [
  {
    q: 'Is the free tier really free for commercial work?',
    a: 'Free covers personal experimentation, hobby prints, and learning. As soon as you list finished pieces or digital STLs on Etsy or sell to clients, Pro provides the verified commercial selling license.',
  },
  {
    q: 'Do my clients or studio viewers need a paid seat?',
    a: 'No. Viewers are free on every tier. On Studio they can review shared pieces; on Pro they get a clean read-only link.',
  },
  {
    q: 'When does billing actually start?',
    a: 'Pro and Studio billing is not live yet — Notify me queues you per plan and we open billing for your plan first. Nothing is charged until then.',
  },
  {
    q: 'What happens to my local projects if I never pay?',
    a: 'Nothing. Local pieces live in your browser storage forever, with unlimited local work and full STL exporters on every tier.',
  },
];

export default function PricingPage() {
  const [period, setPeriod] = useState<BillingPeriod>('annual');
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-[#08090b] text-zinc-900 dark:text-slate-300 font-mono flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-20">
        {/* Hero */}
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-widest text-zinc-500 dark:text-slate-400 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c96f4b]" />
            <span>Pricing // Plans for every stage of the project</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-[1.08]">
            Free to plan. Paid when you bill.
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-zinc-600 dark:text-slate-400 leading-relaxed max-w-xl">
            The sandbox stays free forever. Pro and Studio unlock commercial
            work, cloud sync, and client sharing — billing opens soon, join
            the queue per plan.
          </p>
        </div>

        {/* Billing period toggle */}
        <div className="mt-8 flex items-center gap-3">
          <Tabs
            value={period}
            onValueChange={(v) => setPeriod(v as BillingPeriod)}
          >
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annual">Annual −20%</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Cascading tiles */}
        <div className="mt-10 md:mt-14">
          <PricingTiles period={period} onSelectPlan={setPendingPlan} />
        </div>

        <Separator className="my-14" />

        {/* FAQ */}
        <section className="max-w-3xl">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight font-display">
            Questions, answered
          </h2>
          <Accordion className="mt-4">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-zinc-600 dark:text-slate-400 text-[13px] leading-relaxed">
                    {f.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Early access band (kept separate from Pro) */}
        <section className="mt-14 p-8 rounded-2xl bg-zinc-50 dark:bg-[#0d0f13] border border-zinc-200 dark:border-white/[0.08] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-[11px] font-semibold text-zinc-400 dark:text-slate-500 uppercase tracking-widest">
              Early access // Not the same as Pro
            </div>
            <h3 className="text-xl font-bold text-zinc-950 dark:text-white tracking-tight font-display">
              Want in before billing opens?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-slate-400 leading-relaxed">
              Early access is the free preview queue — weekly invites, no card.
              Pro is the paid tier when it launches. Different lists, different
              promises.
            </p>
          </div>
          <button
            onClick={() => setPendingPlan('pro')}
            className="px-6 py-3 rounded-lg bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-semibold text-xs transition-colors whitespace-nowrap"
          >
            Request Early Access
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-[#060709] py-8 px-4 sm:px-6 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-zinc-900 dark:text-slate-300 font-bold">AMONITE // The 3D Studio for Minimalist Interior Decor</span>
          <div className="flex items-center gap-6">
            <Link href="/sandbox" className="hover:text-zinc-900 dark:hover:text-slate-300 transition-colors">
              Studio Sandbox
            </Link>
            <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-slate-300 transition-colors">
              Documentation
            </Link>
            <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-slate-300 transition-colors">
              Pricing
            </Link>
          </div>
        </div>
      </footer>

      <WaitlistModal
        isOpen={pendingPlan !== null}
        plan={pendingPlan}
        onClose={() => setPendingPlan(null)}
      />
    </div>
  );
}
