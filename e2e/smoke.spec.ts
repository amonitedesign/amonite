import { expect, test } from '@playwright/test';

// Fast smoke — runs on every PR (chromium only, ~1 min).

test('@smoke landing renders hero and studio entry points', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('/');
  await expect(page.getByText(/bespoke minimal vases/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Open Studio Sandbox/ }).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('@smoke sandbox atelier shell loads with archetypes', async ({ page }) => {
  await page.goto('/sandbox');
  await expect(page.getByText('AMONITE ATELIER')).toBeVisible();
  await expect(page.getByText('Base forms')).toBeVisible();
  await expect(page.getByText('Fluted Vase')).toBeVisible();
  await expect(page.getByText('Shape the clay')).toBeVisible();
  await expect(page.getByText('Reset view')).toBeVisible();
});

test('@smoke docs render shortcuts and format specs', async ({ page }) => {
  await page.goto('/docs');
  await expect(page.getByText('Amonite CAD Architecture & Reference')).toBeVisible();
  await expect(page.getByText('Reset view')).toBeVisible();
});
