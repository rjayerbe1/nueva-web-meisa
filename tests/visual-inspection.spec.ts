import { test, expect } from '@playwright/test';

test.describe('Visual Inspection Tests', () => {

  test('Login page visual check', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Tomar screenshot de la página de login
    await page.screenshot({ path: 'tests/screenshots/login-page.png', fullPage: true });
    
    // Verificar elementos de la página de login
    await expect(page.locator('text=Panel MEISA')).toBeVisible();
    await expect(page.locator('text=Accede al sistema de administración')).toBeVisible();
    await expect(page.locator('input[placeholder*="admin@meisa.com.co"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Iniciar Sesión")')).toBeVisible();
    
    console.log('✅ Login page visual check completed');
  });

  test('Home page visual check', async ({ page }) => {
    await page.goto('/');
    
    // Tomar screenshot de la página principal
    await page.screenshot({ path: 'tests/screenshots/home-page.png', fullPage: true });
    
    // Verificar elementos principales
    await expect(page.locator('text=MEISA')).toBeVisible();
    
    console.log('✅ Home page visual check completed');
  });

  test('Login flow manual test', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Rellenar el formulario de login
    await page.fill('input[placeholder*="admin@meisa.com.co"]', 'admin@meisa.com.co');
    await page.fill('input[type="password"]', 'admin123');
    
    // Tomar screenshot antes de hacer click
    await page.screenshot({ path: 'tests/screenshots/login-filled.png', fullPage: true });
    
    // Click en iniciar sesión
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Esperar un momento y tomar screenshot de donde nos redirige
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'tests/screenshots/after-login.png', fullPage: true });
    
    // Verificar la URL actual
    const currentURL = page.url();
    console.log('Current URL after login:', currentURL);
    
    // Si estamos en admin, tomar screenshots
    if (currentURL.includes('/admin')) {
      await page.screenshot({ path: 'tests/screenshots/admin-dashboard.png', fullPage: true });
      
      // Verificar elementos del dashboard
      await expect(page.locator('text=Panel de Administración')).toBeVisible();
      
      // Navegar a proyectos
      await page.goto('/admin/projects');
      await page.screenshot({ path: 'tests/screenshots/admin-projects.png', fullPage: true });
      
      console.log('✅ Admin panel accessed successfully');
    } else {
      console.log('⚠️ Login did not redirect to admin panel');
    }
  });

  test('Test admin pages directly (bypass auth for visual)', async ({ page }) => {
    // Intentar acceder directamente a páginas admin para ver redirecciones
    
    console.log('Testing direct access to /admin...');
    await page.goto('/admin');
    await page.screenshot({ path: 'tests/screenshots/admin-direct.png', fullPage: true });
    
    console.log('Testing direct access to /admin/projects...');
    await page.goto('/admin/projects');
    await page.screenshot({ path: 'tests/screenshots/projects-direct.png', fullPage: true });
    
    console.log('Current URL:', page.url());
    
    // Si nos redirige al login, eso es normal
    if (page.url().includes('/auth/signin')) {
      console.log('✅ Properly redirecting to login for protected routes');
    }
  });

  test('Check responsive design', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.screenshot({ path: 'tests/screenshots/desktop-home.png', fullPage: true });
    
    await page.goto('/auth/signin');
    await page.screenshot({ path: 'tests/screenshots/desktop-login.png', fullPage: true });
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.screenshot({ path: 'tests/screenshots/tablet-home.png', fullPage: true });
    
    await page.goto('/auth/signin');
    await page.screenshot({ path: 'tests/screenshots/tablet-login.png', fullPage: true });
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.screenshot({ path: 'tests/screenshots/mobile-home.png', fullPage: true });
    
    await page.goto('/auth/signin');
    await page.screenshot({ path: 'tests/screenshots/mobile-login.png', fullPage: true });
    
    console.log('✅ Responsive design check completed');
  });

});