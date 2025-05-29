import { test, expect } from '@playwright/test';

test.describe('Final Visual Improvements Test', () => {

  test('Test improved admin design', async ({ page }) => {
    console.log('🎨 Testing improved admin design...');
    
    // LOGIN
    await page.goto('/auth/signin');
    await page.fill('input[placeholder*="admin@meisa.com.co"]', 'admin@meisa.com.co');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForTimeout(3000);
    
    // IMPROVED DASHBOARD
    console.log('📊 Testing improved dashboard...');
    await expect(page).toHaveURL(/.*\/admin$/);
    await page.screenshot({ path: 'tests/screenshots/improved-dashboard.png', fullPage: true });
    
    // Check improved elements
    await expect(page.locator('text=Panel de Administración')).toBeVisible();
    
    // IMPROVED PROJECTS PAGE
    console.log('📋 Testing improved projects page...');
    await page.goto('/admin/projects');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/improved-projects.png', fullPage: true });
    
    // Test search/filter functionality
    const searchInput = page.locator('input[placeholder="Buscar proyectos..."]');
    if (await searchInput.count() > 0) {
      console.log('✅ Search bar found');
    }
    
    // Test improved table
    const table = page.locator('table');
    if (await table.count() > 0) {
      console.log('✅ Improved table found');
      const rows = page.locator('tbody tr');
      console.log(`📊 Table has ${await rows.count()} projects`);
    }
    
    // MOBILE RESPONSIVE
    console.log('📱 Testing improved mobile view...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'tests/screenshots/improved-mobile-projects.png', fullPage: true });
    
    await page.goto('/admin');
    await page.screenshot({ path: 'tests/screenshots/improved-mobile-dashboard.png', fullPage: true });
    
    // TABLET VIEW
    console.log('📲 Testing tablet view...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/admin/projects');
    await page.screenshot({ path: 'tests/screenshots/improved-tablet-projects.png', fullPage: true });
    
    console.log('✅ All visual improvements tested successfully!');
  });

  test('Check sidebar navigation', async ({ page }) => {
    // Login first
    await page.goto('/auth/signin');
    await page.fill('input[placeholder*="admin@meisa.com.co"]', 'admin@meisa.com.co');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForTimeout(3000);
    
    // Check sidebar
    const sidebar = page.locator('text=MEISA').first();
    if (await sidebar.count() > 0) {
      console.log('✅ Sidebar is visible');
      await page.screenshot({ path: 'tests/screenshots/sidebar-navigation.png', fullPage: true });
    }
    
    // Check dark sidebar design
    const darkSidebar = page.locator('.bg-gray-900');
    if (await darkSidebar.count() > 0) {
      console.log('✅ Dark sidebar theme applied');
    }
  });

});