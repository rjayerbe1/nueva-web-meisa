-- Script SQL para migrar categorías en Neon de 9 antiguas → 6 nuevas
-- Ejecutar ANTES de hacer db push

-- Ver estado actual
SELECT 'Categorías en Proyectos:' as info;
SELECT categoria, COUNT(*) as total
FROM proyectos
GROUP BY categoria
ORDER BY categoria;

SELECT 'Categorías en ProyectosHojaVida:' as info;
SELECT categoria, COUNT(*) as total
FROM proyectos_hoja_vida
GROUP BY categoria
ORDER BY categoria;

-- 1. Migrar valores en tabla proyectos
UPDATE proyectos SET categoria = 'COMERCIAL' WHERE categoria = 'CENTROS_COMERCIALES';
UPDATE proyectos SET categoria = 'INDUSTRIAL' WHERE categoria = 'INDUSTRIA';
UPDATE proyectos SET categoria = 'PUENTES' WHERE categoria = 'PUENTES_VEHICULARES';
UPDATE proyectos SET categoria = 'PUENTES' WHERE categoria = 'PUENTES_PEATONALES';
UPDATE proyectos SET categoria = 'INFRAESTRUCTURA_URBANA' WHERE categoria = 'OIL_AND_GAS';
UPDATE proyectos SET categoria = 'EDIFICACIONES' WHERE categoria = 'EDIFICIOS';
UPDATE proyectos SET categoria = 'DEPORTES_EDUCACION' WHERE categoria = 'ESCENARIOS_DEPORTIVOS';
UPDATE proyectos SET categoria = 'EDIFICACIONES' WHERE categoria = 'CUBIERTAS_Y_FACHADAS';
UPDATE proyectos SET categoria = 'INDUSTRIAL' WHERE categoria = 'ESTRUCTURAS_MODULARES';
UPDATE proyectos SET categoria = 'COMERCIAL' WHERE categoria = 'OTRO';

-- 2. Migrar valores en tabla proyectos_hoja_vida
UPDATE proyectos_hoja_vida SET categoria = 'COMERCIAL' WHERE categoria = 'CENTROS_COMERCIALES';
UPDATE proyectos_hoja_vida SET categoria = 'INDUSTRIAL' WHERE categoria = 'INDUSTRIA';
UPDATE proyectos_hoja_vida SET categoria = 'PUENTES' WHERE categoria = 'PUENTES_VEHICULARES';
UPDATE proyectos_hoja_vida SET categoria = 'PUENTES' WHERE categoria = 'PUENTES_PEATONALES';
UPDATE proyectos_hoja_vida SET categoria = 'INFRAESTRUCTURA_URBANA' WHERE categoria = 'OIL_AND_GAS';
UPDATE proyectos_hoja_vida SET categoria = 'EDIFICACIONES' WHERE categoria = 'EDIFICIOS';
UPDATE proyectos_hoja_vida SET categoria = 'DEPORTES_EDUCACION' WHERE categoria = 'ESCENARIOS_DEPORTIVOS';
UPDATE proyectos_hoja_vida SET categoria = 'EDIFICACIONES' WHERE categoria = 'CUBIERTAS_Y_FACHADAS';
UPDATE proyectos_hoja_vida SET categoria = 'INDUSTRIAL' WHERE categoria = 'ESTRUCTURAS_MODULARES';
UPDATE proyectos_hoja_vida SET categoria = 'COMERCIAL' WHERE categoria = 'OTRO';

-- Verificar resultado
SELECT 'Nuevas categorías en Proyectos:' as info;
SELECT categoria, COUNT(*) as total
FROM proyectos
GROUP BY categoria
ORDER BY categoria;

SELECT 'Nuevas categorías en ProyectosHojaVida:' as info;
SELECT categoria, COUNT(*) as total
FROM proyectos_hoja_vida
GROUP BY categoria
ORDER BY categoria;
