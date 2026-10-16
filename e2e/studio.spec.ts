import { expect, test } from '@playwright/test';
import path from 'node:path';

// Heavy studio flows — main branch only (ci-main.yml full matrix).

test('archetype switch reconfigures the vessel', async ({ page }) => {
  await page.goto('/sandbox');
  await page.getByText('Organic Bowl').click();
  // Bowl preset widens the base radius readout to 70 mm.
  await expect(page.getByText('70 mm').first()).toBeVisible();
});

test('slider reshapes the vessel and undo restores it', async ({ page }) => {
  await page.goto('/sandbox');
  const slider = page.getByLabel('Base radius');
  await slider.fill('70');
  await expect(page.getByText('70 mm').first()).toBeVisible();
  await page.keyboard.press('Control+z');
  await expect(page.getByText('45 mm').first()).toBeVisible();
});

test('reset view recenters the vessel', async ({ page }) => {
  await page.goto('/sandbox');
  await page.getByText('Reset view').click();
  await expect(page.getByText('AMONITE ATELIER')).toBeVisible();
});

test('STL download exports the printable vessel', async ({ page }) => {
  await page.goto('/sandbox');
  const downloadPromise = page.waitForEvent('download');
  await page.getByText('Download print file (.stl)').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/amonite-.*\.stl/);
});

test('Etsy Collection batch download exports ZIP archive', async ({ page }) => {
  await page.goto('/sandbox');
  const downloadPromise = page.waitForEvent('download');
  await page.getByText(/Generate Etsy Collection \(ZIP\)/).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/amonite-.*-etsy-drop\.zip/);
});

test('native JSON export triggers a download', async ({ page }) => {
  await page.goto('/sandbox');
  await page.getByText('Files').click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByText('Amonite JSON').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/amonite_project_.*\.amonite\.json/);
});

test('native JSON import restores a project file', async ({ page }) => {
  await page.goto('/sandbox');
  await page.getByText('Files').click();
  await page.getByText('Import Files').click();
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.resolve(__dirname, 'fixtures/valid.amonite.json'));
  await expect(page.getByText('Project successfully restored')).toBeVisible();
});

test('waitlist modal validates email and confirms', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Join Pro Waitlist/ }).first().click();
  await page.getByPlaceholder('you@studio.co').fill('maker@etsy.shop');
  await page.locator('form').getByRole('button', { name: 'Request Early Access' }).click();
  await expect(page.getByText("You're on the list!")).toBeVisible();
});

test('mobile viewport keeps studio operable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/sandbox');
  await expect(page.getByText('AMONITE ATELIER')).toBeVisible();
  await expect(page.getByText('Files')).toBeVisible();
});
