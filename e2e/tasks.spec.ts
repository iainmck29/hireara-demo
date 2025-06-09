import { test, expect } from '@playwright/test';

test.describe('Tasks Page', () => {
  test('should display task list with filters', async ({ page }) => {
    await page.goto('/tasks');

    // Check page title and heading
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
    await expect(page.getByText('Manage and track your team\'s tasks')).toBeVisible();

    // Check New Task button
    await expect(page.getByRole('link', { name: 'New Task' })).toBeVisible();

    // Check filters
    await expect(page.getByPlaceholder('Search tasks...')).toBeVisible();
    await expect(page.getByRole('combobox').first()).toBeVisible(); // Status filter
    await expect(page.getByRole('combobox').nth(1)).toBeVisible(); // Priority filter

    // Check that tasks are displayed
    await expect(page.getByText('Implement user authentication')).toBeVisible();
    await expect(page.getByText('Design new dashboard layout')).toBeVisible();
  });

  test('should filter tasks by status', async ({ page }) => {
    await page.goto('/tasks');

    // Select 'Completed' status filter
    await page.getByRole('combobox').first().selectOption('completed');

    // Should show completed tasks
    await expect(page.getByText('Design new dashboard layout')).toBeVisible();
    await expect(page.getByText('Create marketing campaign')).toBeVisible();

    // Should not show non-completed tasks
    await expect(page.getByText('Implement user authentication')).not.toBeVisible();
  });

  test('should search tasks', async ({ page }) => {
    await page.goto('/tasks');

    // Search for "authentication"
    await page.getByPlaceholder('Search tasks...').fill('authentication');

    // Should show matching task
    await expect(page.getByText('Implement user authentication')).toBeVisible();

    // Should not show non-matching tasks
    await expect(page.getByText('Design new dashboard layout')).not.toBeVisible();
  });

  test('should navigate to new task form', async ({ page }) => {
    await page.goto('/tasks');

    // Click New Task button
    await page.getByRole('link', { name: 'New Task' }).click();

    // Should be on new task page
    await expect(page).toHaveURL('/tasks/new');
    await expect(page.getByRole('heading', { name: 'Create New Task' })).toBeVisible();
  });

  test('should view task details', async ({ page }) => {
    await page.goto('/tasks');

    // Click View button on first task
    await page.getByRole('link', { name: 'View' }).first().click();

    // Should be on task detail page
    await expect(page.url()).toMatch(/\/tasks\/task-\d+/);
    await expect(page.getByText('Back to Tasks')).toBeVisible();
  });
});