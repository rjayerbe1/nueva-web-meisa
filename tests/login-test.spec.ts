import { test, expect } from '@playwright/test';

test.describe('Login Test', () => {

  test('Test login and admin access', async ({ page }) => {
    console.log('🔄 Starting login test...');
    
    // Ir a la página de login
    await page.goto('/auth/signin');
    console.log('✅ Navigated to login page');
    
    // Llenar formulario
    await page.fill('input[placeholder*="admin@meisa.com.co"]', 'admin@meisa.com.co');
    await page.fill('input[type="password"]', 'admin123');
    console.log('✅ Filled login form');
    
    // Tomar screenshot antes del login
    await page.screenshot({ path: 'tests/screenshots/before-login-submit.png', fullPage: true });
    
    // Click en login
    await page.click('button:has-text("Iniciar Sesión")');
    console.log('✅ Clicked login button');
    
    // Esperar un poco para que procese
    await page.waitForTimeout(5000);
    
    // Verificar URL actual
    const currentURL = page.url();
    console.log('🔍 Current URL after login:', currentURL);
    
    // Tomar screenshot después del login
    await page.screenshot({ path: 'tests/screenshots/after-login-fixed.png', fullPage: true });
    
    // Verificar si estamos en admin
    if (currentURL.includes('/admin')) {
      console.log('🎉 SUCCESS: Redirected to admin panel!');
      
      // Verificar elementos del admin
      await expect(page.locator('h1:has-text("Panel de Administración")')).toBeVisible();
      console.log('✅ Admin dashboard loaded');
      
      // Tomar screenshot del dashboard
      await page.screenshot({ path: 'tests/screenshots/admin-dashboard-success.png', fullPage: true });
      
      // Navegar a proyectos
      await page.goto('/admin/projects');
      await page.waitForTimeout(2000);
      
      // Verificar página de proyectos
      await expect(page.locator('h1:has-text("Gestión de Proyectos")')).toBeVisible();
      console.log('✅ Projects page loaded');
      
      // Tomar screenshot de proyectos
      await page.screenshot({ path: 'tests/screenshots/admin-projects-success.png', fullPage: true });
      
    } else {
      console.log('❌ FAIL: Login did not redirect to admin');
      console.log('Current URL:', currentURL);
      
      // Intentar ir manualmente a admin
      await page.goto('/admin');
      await page.waitForTimeout(2000);
      
      const adminURL = page.url();
      console.log('URL after manual admin navigation:', adminURL);
      
      if (adminURL.includes('/admin')) {
        console.log('✅ Manual navigation to admin works');
      } else {
        console.log('❌ Manual navigation to admin failed');
      }
    }
  });

});