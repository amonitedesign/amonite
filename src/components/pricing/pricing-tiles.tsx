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
    tagline: 'Plan rooms locally, no account, no tracking.',
    monthly: 0,
    annual: 0,
    cta: 'Open sandbox',
    features: [
      'Unlimited local projects',
      'Floor-plan + 3D viewport',
      'DXF / SVG / STL export',
      '3 cloud projects · 25 MB',
      'Non-commercial license',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For solo designers billing clients.',
    monthly: 20,
    annual: 16,
    cta: 'Notify me',
    featured: true,
    badge: 'Most popular',
    features: [
      'Everything in Free, commercial license',
      'Unlimited cloud projects · 50 GB',
      'Cloud sync across devices',
      'Material libraries + cut lists',
      'Client share links',
      'Render + AI credit pool',
      'Priority support',
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    tagline: 'For practices. Viewers always free.',
    monthly: 30,
    annual: 24,
    cta: 'Talk to us',
    features: [
      'Everything in Pro, per editor',
      'Team workspace + roles',
      'Unlimited client links + commenting',
      'Consolidated billing',
      'Advanced CAM toolpaths',
      'Dedicated support',
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
                ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] md:-translate-y-6'
                : 'md:translate-y-2'
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    {tier.name}
                  </span>
                </span>
                {tier.badge && <Badge variant="default">{tier.badge}</Badge>}
              </div>
              <CardTitle className="pt-2 text-3xl font-bold">
                {priceLabel(tier, period)}
                {tier.monthly > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {' '}
                    / mo{period === 'annual' ? ', billed annually' : ''}
                  </span>
                )}
              </CardTitle>
              <CardDescription>{tier.tagline}</CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px]">
                    <RiCheckLine className="mt-0.5 size-4 shrink-0 text-cyan-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {tier.id !== 'free' && (
                <p className="mt-4 text-[11px] text-muted-foreground">
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
                  className="w-full"
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
