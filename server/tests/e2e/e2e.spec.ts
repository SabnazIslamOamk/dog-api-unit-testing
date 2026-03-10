import { test, expect } from '@playwright/test';

// base URL for the front-end application (Vite dev server)
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// helper selector names
const imageSelector = 'img.dog-image';
const buttonSelector = 'button.fetch-button';
const errorSelector = '.error';

// ------------------------
// Positive flow - initial load
// ------------------------
test('dog image loads when page is opened', async ({ page }) => {
  await page.goto(BASE_URL);
  // wait for the API request and image to appear
  await page.waitForResponse('**/api/dogs/random');
  const image = page.locator(imageSelector);
  await expect(image).toHaveAttribute('src', /^https:\/\//);
});

// ------------------------
// Positive flow - click button
// ------------------------
test('dog image updates when "Get Another Dog" button is clicked', async ({ page }) => {
  await page.goto(BASE_URL);
  // wait for first load
  await page.waitForResponse('**/api/dogs/random');

  // click to fetch another dog and wait for the call
  await Promise.all([
    page.waitForResponse('**/api/dogs/random'),
    page.click(buttonSelector)
  ]);

  const image = page.locator(imageSelector);
  await expect(image).toHaveAttribute('src', /^https:\/\//);
});

// ------------------------
// Negative flow - API failure
// ------------------------
test('shows error message when API call fails', async ({ page }) => {
  // intercept and abort any request to the dog endpoint
  await page.route('**/api/dogs/random', route => route.abort());

  await page.goto(BASE_URL);
  const err = await page.locator(errorSelector);
  await expect(err).toBeVisible();
  await expect(err).toHaveText(/error/i);
});
