'use client';

import React from 'react';
import Link from 'next/link';
import {
  RiCheckLine,
  RiSparklingLine,
  RiBuildingLine,
  RiLeafLine,
} from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export type PlanId = 'free' | 'pro' | 'studio';
export type BillingPeriod = 'monthly' | 'annual';

export interface TierInfo {
  id: PlanId;
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  cta: string;
  featured?: boolean;
  badge?: string;
  features: string[];
}

export const TIERS: TierInfo[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Shape minimal decor locally with zero account or tracking.',
    monthly: 0,
    annual: 0,
    cta: 'Open sandbox',
    features: [
      '4 Architectural base archetypes',
      'Infinite parametric fluting & rib controls',
      'Watertight single-vessel STL export',
      'Local auto-save in private browser storage',
      'Non-commercial personal license',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For boutique makers, Etsy sellers & ceramicists.',
    monthly: 20,
    annual: 16,
    cta: 'Notify me',
    featured: true,
    badge: 'Most popular',
    features: [
      'Everything in Free, commercial selling license',
      '1-Click Etsy Collection Generator (6 STLs + mockups)',
      'Ceramic Kiln Shrinkage Tool (Stoneware & Porcelain)',
      'Studio mockup PNG renders for Etsy listings',
      'Single-wall spiralize Vase Mode certified',
      'Priority maker support',
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    tagline: 'For decor practices, lighting brands & ceramics teams.',
    monthly: 30,
    annual: 24,
    cta: 'Talk to us',
    features: [
      'Everything in Pro, per studio member',
      'Modular multi-part lighting shells & lampshades',
      'Custom batch clay shrinkage recipes',
      'Direct vector DXF + SVG 2D elevations',
      'Shared studio collection presets',
      'Dedicated onboarding & custom tooling',
    ],
  },
];

function priceLabel(tier: TierInfo, period: BillingPeriod): string {
  if (tier.monthly === 0) return '$0';
  const v = period === 'annual' ? tier.annual : tier.monthly;
  return `$${v}`;
}

export default function PricingTiles({
  period,
  onSelectPlan,
}: {
  period: BillingPeriod;
  onSelectPlan: (plan: PlanId) => void;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3 md:items-start">
      {TIERS.map((tier) => {
        const Icon =
          tier.id === 'pro'
            ? RiSparklingLine
            : tier.id === 'studio'
              ? RiBuildingLine
              : RiLeafLine;
        return (
          <Card
            key={tier.id}
            data-testid={`tier-${tier.id}`}
            className={
              tier.featured
                ? 'border-[#c96f4b]/50 shadow-xl shadow-[#c96f4b]/5 md:-translate-y-6'
                : 'md:translate-y-2'
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="size-4 text-[#c96f4b]" />
                  <span className="text-xs font-semibold uppercase tracking-widest font-mono">
                    {tier.name}
                  </span>
                </span>
                {tier.badge && (
                  <Badge variant="default" className="bg-[#c96f4b] hover:bg-[#b86240] text-white font-mono text-[10px]">
                    {tier.badge}
                  </Badge>
                )}
              </div>
              <CardTitle className="pt-2 text-3xl font-bold font-display">
                {priceLabel(tier, period)}
                {tier.monthly > 0 && (
                  <span className="text-sm font-normal text-muted-foreground font-mono">
                    {' '}
                    / mo{period === 'annual' ? ', billed annually' : ''}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">{tier.tagline}</CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px]">
                    <RiCheckLine className="mt-0.5 size-4 shrink-0 text-[#c96f4b]" />
                    <span className="leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              {tier.id !== 'free' && (
                <p className="mt-4 text-[11px] text-muted-foreground font-mono">
                  Coming soon — join the queue and we&apos;ll open billing for
                  your plan first.
                </p>
              )}
            </CardContent>
            <CardFooter>
              {tier.id === 'free' ? (
                <Button
                  variant="outline"
                  className="w-full"
                  nativeButton={false}
                  render={<Link href="/sandbox">Open sandbox</Link>}
                />
              ) : (
                <Button
                  variant={tier.featured ? 'default' : 'outline'}
                  className={tier.featured ? 'w-full bg-[#c96f4b] hover:bg-[#b86240] text-white font-medium' : 'w-full'}
                  onClick={() => onSelectPlan(tier.id)}
                >
                  {tier.cta}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
