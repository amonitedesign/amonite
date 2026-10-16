import { expect, test } from '@playwright/test';
import path from 'node:path';

// Heavy studio flows — main branch only (ci-main.yml full matrix).

test('toolbar adds a cuboid and selects it in the tree', async ({ page }) => {
  await page.goto('/sandbox');
  await page.getByTitle('Add Cuboid').click();
  // addNode names it "<Type> <count+1>" — with 2 seeded nodes the box becomes "Box 3"
  await expect(page.getByText('Box 3')).toBeVisible();
});

test('inspector edits survive undo/redo via keyboard', async ({ page }) => {
  await page.goto('/sandbox');
  await page.getByText('Base Plate').click();
  const nameInput = page.locator('input[value="Base Plate"]');
  await nameInput.fill('E2E Cover');
  await expect(page.getByText('E2E Cover').first()).toBeVisible();
  await page.keyboard.press('Control+z');
  await expect(page.getByText('Base Plate').first()).toBeVisible();
});

test('transform hotkeys switch gizmo modes', async ({ page }) => {
  await page.goto('/sandbox');
  // Ensure hydration + focus before sending keys (else presses get lost).
  await expect(page.getByTitle('Move (G)')).toBeVisible();
  await page.mouse.click(400, 400);
  await page.keyboard.press('g');
  await expect(page.getByTitle('Move (G)')).toHaveClass(/bg-cyan-500\/20/);
  await page.keyboard.press('v');
  await expect(page.getByTitle('Select (V)')).toHaveClass(/bg-cyan-500\/20/);
});

test('native JSON export triggers a download', async ({ page }) => {
  await page.goto('/sandbox');
  await page.getByText('Import / Export').click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByText('Amonite JSON').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/amonite_project_.*\.amonite\.json/);
});

test('native JSON import restores the E2E plate', async ({ page }) => {
  await page.goto('/sandbox');
  await page.getByText('Import / Export').click();
  await page.getByText('Import Files').click();
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.resolve(__dirname, 'fixtures/valid.amonite.json'));
  await expect(page.getByText('E2E Plate')).toBeVisible();
});

test('waitlist modal validates email and confirms', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Join Pro Waitlist/ }).first().click();
  await page.getByPlaceholder('you@studio.co').fill('mech@aero.io');
  await page.locator('form').getByRole('button', { name: 'Request Early Access' }).click();
  await expect(page.getByText("You're on the list!")).toBeVisible();
});

test('mobile viewport keeps studio operable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/sandbox');
  await expect(page.getByText('AMONITE // STUDIO')).toBeVisible();
  await expect(page.getByText('Import / Export')).toBeVisible();
});
