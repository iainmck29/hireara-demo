import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should display dashboard with stats and recent tasks', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/TaskFlow Dashboard/);

    // Check main heading
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Check that stats are displayed
    await expect(page.getByText('Total Tasks')).toBeVisible();
    await expect(page.getByText('Completed Today')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Overdue')).toBeVisible();
    await expect(page.getByText('Team Members')).toBeVisible();
    await expect(page.getByText('Completion Rate')).toBeVisible();

    // Check recent tasks section
    await expect(page.getByText('Recent Tasks')).toBeVisible();
    await expect(page.getByText('View all')).toBeVisible();
  });

  test('should navigate to tasks page from dashboard', async ({ page }) => {
    await page.goto('/');

    // Click on "View all" link in recent tasks
    await page.getByRole('link', { name: 'View all' }).click();

    // Should be on tasks page
    await expect(page).toHaveURL('/tasks');
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate between pages using sidebar', async ({ page }) => {
    await page.goto('/');

    // Test navigation to Tasks
    await page.getByRole('link', { name: 'Tasks' }).click();
    await expect(page).toHaveURL('/tasks');
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();

    // Test navigation to Analytics
    await page.getByRole('link', { name: 'Analytics' }).click();
    await expect(page).toHaveURL('/analytics');
    await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible();

    // Test navigation to Profile
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL('/profile');
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();

    // Test navigation back to Dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});