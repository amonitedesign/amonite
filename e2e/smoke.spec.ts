import { expect, test } from '@playwright/test';

// Fast smoke — runs on every PR (chromium only, ~1 min).

test('@smoke landing renders hero and studio entry points', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('/');
  await expect(page.getByText(/Sculpt minimal 3D objects/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Open Studio Sandbox/ }).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('@smoke sandbox studio shell loads with scene hierarchy', async ({ page }) => {
  await page.goto('/sandbox');
  await expect(page.getByText('AMONITE // STUDIO')).toBeVisible();
  await expect(page.getByText('Scene Hierarchy')).toBeVisible();
  await expect(page.getByText('Import / Export')).toBeVisible();
});

test('@smoke docs render shortcuts and format specs', async ({ page }) => {
  await page.goto('/docs');
  await expect(page.getByText('Amonite CAD Architecture & Reference')).toBeVisible();
  await expect(page.getByText('Coordinate Frame & Units')).toBeVisible();
});
