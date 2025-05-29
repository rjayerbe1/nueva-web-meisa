import { test, expect } from '@playwright/test';

test.describe('Complete Admin Flow', () => {

  test('Full admin flow with screenshots', async ({ page }) => {
    console.log('🔄 Testing complete admin flow...');
    
    // LOGIN
    await page.goto('/auth/signin');
    await page.fill('input[placeholder*="admin@meisa.com.co"]', 'admin@meisa.com.co');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForTimeout(3000);
    
    // DASHBOARD
    console.log('📊 Testing dashboard...');
    await expect(page).toHaveURL(/.*\/admin$/);
    await page.screenshot({ path: 'tests/screenshots/final-dashboard.png', fullPage: true });
    
    // PROJECTS PAGE
    console.log('📋 Testing projects page...');
    await page.goto('/admin/projects');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/final-projects.png', fullPage: true });
    
    // Check projects page elements
    await expect(page.locator('text=Gestión de Proyectos')).toBeVisible();
    await expect(page.locator('text=Nuevo Proyecto')).toBeVisible();
    
    // Check if there are projects in the table
    const tableRows = page.locator('table tbody tr');
    const projectCount = await tableRows.count();
    console.log(`📈 Found ${projectCount} projects in table`);
    
    if (projectCount > 0) {
      console.log('✅ Projects table has data');
      // Check action buttons exist
      const actionButtons = page.locator('td a, td button');
      const buttonCount = await actionButtons.count();
      console.log(`🔘 Found ${buttonCount} action buttons`);
    } else {
      console.log('ℹ️  No projects found - showing empty state');
    }
    
    // Test responsive on mobile
    console.log('📱 Testing mobile view...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'tests/screenshots/final-mobile-projects.png', fullPage: true });
    
    await page.goto('/admin');
    await page.screenshot({ path: 'tests/screenshots/final-mobile-dashboard.png', fullPage: true });
    
    console.log('✅ Complete admin flow test finished successfully!');
  });

});