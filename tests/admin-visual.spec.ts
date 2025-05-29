import { test, expect } from '@playwright/test';

test.describe('Admin Panel Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/auth/signin');
    
    // Hacer login con las credenciales de admin - usar placeholder como selector
    await page.fill('input[placeholder*="admin@meisa.com.co"]', 'admin@meisa.com.co');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Esperar a ser redirigido al dashboard
    await page.waitForURL('/admin');
  });

  test('Dashboard visual appearance', async ({ page }) => {
    // Verificar que el dashboard se carga correctamente
    await expect(page.locator('h1')).toContainText('Panel de Administración');
    
    // Tomar screenshot del dashboard
    await page.screenshot({ path: 'tests/screenshots/dashboard.png', fullPage: true });
    
    // Verificar elementos principales del dashboard
    await expect(page.locator('[data-testid="stats-grid"]').or(page.locator('.grid').first())).toBeVisible();
    await expect(page.locator('text=Proyectos Recientes')).toBeVisible();
    await expect(page.locator('text=Acciones Rápidas')).toBeVisible();
  });

  test('Projects page visual appearance', async ({ page }) => {
    // Navegar a la página de proyectos
    await page.goto('/admin/projects');
    
    // Verificar que la página se carga
    await expect(page.locator('h1')).toContainText('Gestión de Proyectos');
    
    // Tomar screenshot de la página de proyectos
    await page.screenshot({ path: 'tests/screenshots/projects-page.png', fullPage: true });
    
    // Verificar elementos clave
    await expect(page.locator('text=Nuevo Proyecto')).toBeVisible();
    await expect(page.locator('text=Total Proyectos')).toBeVisible();
    await expect(page.locator('text=Todos los Proyectos')).toBeVisible();
    
    // Verificar que la tabla se muestra correctamente
    const table = page.locator('table').or(page.locator('.overflow-x-auto'));
    if (await table.count() > 0) {
      await expect(table.first()).toBeVisible();
    }
  });

  test('Layout and spacing issues', async ({ page }) => {
    // Verificar el layout general del admin
    await page.goto('/admin');
    
    // Verificar el header
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Verificar el sidebar
    const sidebar = page.locator('[class*="lg:pl-72"]').or(page.locator('aside'));
    if (await sidebar.count() > 0) {
      await expect(sidebar.first()).toBeVisible();
    }
    
    // Verificar el contenido principal
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Tomar screenshot del layout completo
    await page.screenshot({ path: 'tests/screenshots/admin-layout.png', fullPage: true });
    
    // Verificar espaciado - buscar elementos con mucho padding/margin
    const mainContent = page.locator('main > div');
    if (await mainContent.count() > 0) {
      const boundingBox = await mainContent.first().boundingBox();
      console.log('Main content dimensions:', boundingBox);
    }
  });

  test('Projects table functionality', async ({ page }) => {
    await page.goto('/admin/projects');
    
    // Verificar si hay proyectos o mensaje de vacío
    const emptyMessage = page.locator('text=No hay proyectos');
    const projectsTable = page.locator('table tbody tr');
    
    if (await emptyMessage.count() > 0) {
      console.log('No projects found - showing empty state');
      await expect(emptyMessage).toBeVisible();
    } else if (await projectsTable.count() > 0) {
      console.log('Projects found in table');
      await expect(projectsTable.first()).toBeVisible();
      
      // Verificar botones de acción
      const actionButtons = page.locator('td button, td a');
      if (await actionButtons.count() > 0) {
        await expect(actionButtons.first()).toBeVisible();
      }
    }
    
    // Tomar screenshot específico de la tabla
    await page.screenshot({ path: 'tests/screenshots/projects-table.png' });
  });

  test('Mobile responsiveness check', async ({ page }) => {
    // Simular vista mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/admin');
    await page.screenshot({ path: 'tests/screenshots/admin-mobile.png', fullPage: true });
    
    await page.goto('/admin/projects');
    await page.screenshot({ path: 'tests/screenshots/projects-mobile.png', fullPage: true });
    
    // Verificar que los elementos principales siguen siendo visibles
    await expect(page.locator('h1')).toBeVisible();
    
    // Verificar botón de menú móvil si existe
    const mobileMenuButton = page.locator('button[class*="lg:hidden"]');
    if (await mobileMenuButton.count() > 0) {
      await expect(mobileMenuButton.first()).toBeVisible();
    }
  });
});