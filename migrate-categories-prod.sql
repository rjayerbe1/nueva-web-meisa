-- Migración: Mover proyectos de ESTRUCTURAS_MODULARES y OTRO a otras categorías
-- Fecha: 2025-01-18

BEGIN;

-- 1. Mover todos los Dollar City (ESTRUCTURAS_MODULARES) a COMERCIAL
UPDATE "Proyecto"
SET categoria = 'COMERCIAL'
WHERE categoria = 'ESTRUCTURAS_MODULARES';

-- 2. Mover Complejo Acuático Pereira (OTRO) a ESCENARIOS_DEPORTIVOS
UPDATE "Proyecto"
SET categoria = 'ESCENARIOS_DEPORTIVOS'
WHERE titulo = 'Complejo Acuatico Pereira' AND categoria = 'OTRO';

-- 3. Mover Tanques de Almacenamiento GLP (OTRO) a INDUSTRIA
UPDATE "Proyecto"
SET categoria = 'INDUSTRIA'
WHERE titulo = 'Tanques de Almacenamiento GLP' AND categoria = 'OTRO';

-- 4. Verificar que no queden proyectos en las categorías a eliminar
DO $$
DECLARE
  count_remaining INTEGER;
BEGIN
  SELECT COUNT(*) INTO count_remaining
  FROM "Proyecto"
  WHERE categoria IN ('ESTRUCTURAS_MODULARES', 'OTRO');

  IF count_remaining > 0 THEN
    RAISE EXCEPTION 'Aún quedan % proyectos en ESTRUCTURAS_MODULARES o OTRO', count_remaining;
  ELSE
    RAISE NOTICE 'Todos los proyectos han sido migrados correctamente';
  END IF;
END $$;

COMMIT;
