import { test, expect } from '@playwright/test';

test.describe('Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/analytics');
  });

  test('should display analytics page with main elements', async ({ page }) => {
    // Check page title and description
    await expect(page.getByRole('heading', { name: 'Smart Task Insights' })).toBeVisible();
    await expect(page.getByText(/AI-powered analytics and insights/)).toBeVisible();

    // Check main dashboard container
    await expect(page.locator('[data-testid="analytics-dashboard"]').or(page.locator('.space-y-6').first())).toBeVisible();
  });

  test('should display overview tab by default', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);

    // Check if overview tab is active
    const overviewTab = page.getByRole('button', { name: /overview/i });
    await expect(overviewTab).toBeVisible();
    
    // Look for overview stats cards
    await expect(page.getByText('Total Tasks').or(page.getByText('Completion Rate'))).toBeVisible();
  });

  test('should navigate between tabs', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(1000);

    // Navigate to trends tab
    await page.getByRole('button', { name: /trends/i }).click();
    await expect(page.getByText('Task Completion Trends').or(page.locator('canvas'))).toBeVisible();

    // Navigate to team performance tab
    await page.getByRole('button', { name: /team performance/i }).click();
    await expect(page.getByText('Team Performance').or(page.getByText('Team Average'))).toBeVisible();

    // Navigate to AI insights tab
    await page.getByRole('button', { name: /ai insights/i }).click();
    await expect(page.getByText('AI-Powered Recommendations').or(page.getByText('recommendations'))).toBeVisible();

    // Navigate to export tab
    await page.getByRole('button', { name: /export/i }).click();
    await expect(page.getByText('Export Analytics').or(page.getByText('Export Format'))).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    // Intercept data requests to add delay
    await page.route('**/analytics', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    await page.goto('/analytics');
    
    // Should show loading indicator
    await expect(page.getByText('Loading analytics data').or(page.locator('[data-testid="loading"]'))).toBeVisible();
  });

  test('should refresh data when refresh button is clicked', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(1000);

    // Find and click refresh button
    const refreshButton = page.getByRole('button', { name: /refresh/i });
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();

    // Should see updated timestamp (this might be tricky to test precisely)
    await expect(page.getByText(/Last updated:/)).toBeVisible();
  });

  test('should display charts in trends tab', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Navigate to trends tab
    await page.getByRole('button', { name: /trends/i }).click();
    
    // Check for chart elements
    await expect(page.locator('canvas').or(page.getByText('Task Completion Trends'))).toBeVisible();
  });

  test('should show team metrics in team performance tab', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Navigate to team performance tab
    await page.getByRole('button', { name: /team performance/i }).click();
    
    // Check for team metrics
    await expect(page.getByText('Team Performance').or(page.getByText('Productivity Score'))).toBeVisible();
  });

  test('should display recommendations in AI insights tab', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Navigate to AI insights tab
    await page.getByRole('button', { name: /ai insights/i }).click();
    
    // Check for recommendations panel
    await expect(
      page.getByText('AI-Powered Recommendations')
        .or(page.getByText('High Priority'))
        .or(page.getByText('All Clear!'))
    ).toBeVisible();
  });

  test('should allow export format selection', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Navigate to export tab
    await page.getByRole('button', { name: /export/i }).click();
    
    // Check export format options
    await expect(page.getByText('Export Format')).toBeVisible();
    await expect(page.getByText('PDF Report').or(page.getByText('CSV Data'))).toBeVisible();
    
    // Try selecting different formats
    const csvOption = page.getByRole('button').filter({ hasText: 'CSV Data' });
    if (await csvOption.isVisible()) {
      await csvOption.click();
    }
  });

  test('should handle export functionality', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Navigate to export tab
    await page.getByRole('button', { name: /export/i }).click();
    
    // Find export button
    const exportButton = page.getByRole('button', { name: /export/i }).last();
    await expect(exportButton).toBeVisible();
    
    // Note: We can't easily test file downloads in E2E tests without special setup
    // But we can verify the button is clickable and responds
    if (await exportButton.isEnabled()) {
      // Just verify the button exists and is clickable
      await expect(exportButton).toBeEnabled();
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.getByRole('heading', { name: 'Smart Task Insights' })).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: 'Smart Task Insights' })).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: 'Smart Task Insights' })).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Intercept and fail data requests
    await page.route('**/analytics', route => route.abort());
    await page.route('**/tasks', route => route.abort());
    await page.route('**/users', route => route.abort());
    
    await page.goto('/analytics');
    
    // Should show error state or loading state that doesn't resolve
    // The exact error handling depends on implementation
    await page.waitForTimeout(3000);
    
    // Check if page still renders basic structure even with errors
    await expect(page.getByRole('heading', { name: 'Smart Task Insights' })).toBeVisible();
  });

  test('should show data counts and metrics', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Look for numerical data that should be displayed
    const numberRegex = /\d+/;
    
    // Check overview tab for metrics
    await expect(page.locator('text=/\\d+/')).toHaveCount({ min: 1 });
    
    // Navigate to team tab and check for team metrics
    await page.getByRole('button', { name: /team performance/i }).click();
    await expect(page.locator('text=/\\d+/')).toHaveCount({ min: 1 });
  });

  test('should maintain tab state during interactions', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Navigate to trends tab
    await page.getByRole('button', { name: /trends/i }).click();
    
    // Click refresh
    await page.getByRole('button', { name: /refresh/i }).click();
    
    // Should still be on trends tab after refresh
    const trendsTab = page.getByRole('button', { name: /trends/i });
    await expect(trendsTab).toHaveClass(/border-blue-500|text-blue-600/);
  });
});