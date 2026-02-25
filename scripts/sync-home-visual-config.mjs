#!/usr/bin/env node

/**
 * DEPRECATED: Ya no se necesita. El desarrollo ahora usa Neon directamente.
 * Se conserva como referencia.
 *
 * Sync home visual config between databases.
 *
 * Includes:
 * - configuracion_sitio.clave = "hero_images"
 * - visual fields in categorias_proyecto
 *
 * Usage:
 *   DATABASE_URL_LOCAL="postgresql://..." DATABASE_URL_NEON="postgresql://..." node scripts/sync-home-visual-config.mjs
 *   DATABASE_URL_LOCAL="postgresql://..." DATABASE_URL_NEON="postgresql://..." node scripts/sync-home-visual-config.mjs --apply
 *
 * Flags:
 *   --apply    Apply changes to target DB (without this flag, it is dry-run)
 *   --verbose  Print full field values for differences
 */

import { PrismaClient } from '@prisma/client'

const args = new Set(process.argv.slice(2))
const applyChanges = args.has('--apply')
const verbose = args.has('--verbose')

const sourceUrl =
  process.env.DATABASE_URL_LOCAL ||
  process.env.SOURCE_DATABASE_URL ||
  process.env.DATABASE_URL

const targetUrl =
  process.env.DATABASE_URL_NEON ||
  process.env.TARGET_DATABASE_URL ||
  process.env.PROD_DATABASE_URL

const VISUAL_CATEGORY_FIELDS = [
  'imagenCover',
  'imagenBanner',
  'videoCover',
  'videoBanner',
  'usarVideoCover',
  'usarVideoBanner',
  'videoCoverPosition',
  'videoCoverScale',
  'videoBannerPosition',
  'videoBannerScale',
  'icono',
  'color',
  'colorSecundario',
  'overlayColor',
  'overlayOpacity',
  'hoverOverlayColor',
  'hoverOverlayOpacity',
  'enableHoverOverlay',
]

function maskDbUrl(url) {
  if (!url) return '(missing)'
  return url.replace(/(postgres(?:ql)?:\/\/)([^:@]+)(:[^@]+)?@/, '$1***:***@')
}

function valuesAreDifferent(a, b) {
  if (a === b) return false
  if (a == null && b == null) return false
  return true
}

async function run() {
  if (!sourceUrl || !targetUrl) {
    console.error('Missing database URLs.')
    console.error('Required:')
    console.error('  - source: DATABASE_URL_LOCAL or SOURCE_DATABASE_URL or DATABASE_URL')
    console.error('  - target: DATABASE_URL_NEON or TARGET_DATABASE_URL or PROD_DATABASE_URL')
    process.exit(1)
  }

  if (sourceUrl === targetUrl) {
    console.error('Source and target DB URLs are identical. Aborting.')
    process.exit(1)
  }

  const source = new PrismaClient({ datasources: { db: { url: sourceUrl } } })
  const target = new PrismaClient({ datasources: { db: { url: targetUrl } } })

  console.log('\nHome visual config sync')
  console.log(`Source DB: ${maskDbUrl(sourceUrl)}`)
  console.log(`Target DB: ${maskDbUrl(targetUrl)}`)
  console.log(`Mode: ${applyChanges ? 'APPLY' : 'DRY-RUN'}`)
  console.log(''.padEnd(72, '-'))

  try {
    const [sourceHero, targetHero] = await Promise.all([
      source.configuracionSitio.findUnique({ where: { clave: 'hero_images' } }),
      target.configuracionSitio.findUnique({ where: { clave: 'hero_images' } }),
    ])

    const sourceCategories = await source.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' },
      select: {
        key: true,
        nombre: true,
        slug: true,
        imagenCover: true,
        imagenBanner: true,
        videoCover: true,
        videoBanner: true,
        usarVideoCover: true,
        usarVideoBanner: true,
        videoCoverPosition: true,
        videoCoverScale: true,
        videoBannerPosition: true,
        videoBannerScale: true,
        icono: true,
        color: true,
        colorSecundario: true,
        overlayColor: true,
        overlayOpacity: true,
        hoverOverlayColor: true,
        hoverOverlayOpacity: true,
        enableHoverOverlay: true,
      },
    })

    const targetCategories = await target.categoriaProyecto.findMany({
      select: {
        key: true,
        nombre: true,
        slug: true,
        imagenCover: true,
        imagenBanner: true,
        videoCover: true,
        videoBanner: true,
        usarVideoCover: true,
        usarVideoBanner: true,
        videoCoverPosition: true,
        videoCoverScale: true,
        videoBannerPosition: true,
        videoBannerScale: true,
        icono: true,
        color: true,
        colorSecundario: true,
        overlayColor: true,
        overlayOpacity: true,
        hoverOverlayColor: true,
        hoverOverlayOpacity: true,
        enableHoverOverlay: true,
      },
    })

    const targetByKey = new Map(targetCategories.map((c) => [c.key, c]))

    const heroDiff =
      (sourceHero?.valor || null) !== (targetHero?.valor || null) ||
      (sourceHero?.tipo || null) !== (targetHero?.tipo || null) ||
      (sourceHero?.descripcion || null) !== (targetHero?.descripcion || null) ||
      (sourceHero?.categoria || null) !== (targetHero?.categoria || null)

    const categoryDiffs = []
    const missingInTarget = []

    for (const sourceCat of sourceCategories) {
      const targetCat = targetByKey.get(sourceCat.key)
      if (!targetCat) {
        missingInTarget.push(sourceCat)
        continue
      }

      const fieldDiffs = []
      for (const field of VISUAL_CATEGORY_FIELDS) {
        if (valuesAreDifferent(sourceCat[field], targetCat[field])) {
          fieldDiffs.push(field)
        }
      }

      if (fieldDiffs.length > 0) {
        categoryDiffs.push({
          key: sourceCat.key,
          nombre: sourceCat.nombre,
          diffs: fieldDiffs,
          source: sourceCat,
          target: targetCat,
        })
      }
    }

    console.log(`Hero config differs: ${heroDiff ? 'YES' : 'NO'}`)
    console.log(`Categories checked: ${sourceCategories.length}`)
    console.log(`Categories with diffs: ${categoryDiffs.length}`)
    console.log(`Categories missing in target: ${missingInTarget.length}`)

    if (missingInTarget.length > 0) {
      console.log('\nMissing categories in target DB:')
      for (const cat of missingInTarget) {
        console.log(`- ${cat.key} (${cat.nombre})`)
      }
    }

    if (categoryDiffs.length > 0) {
      console.log('\nCategory differences:')
      for (const diff of categoryDiffs) {
        console.log(`- ${diff.key} (${diff.nombre}): ${diff.diffs.join(', ')}`)
        if (verbose) {
          for (const field of diff.diffs) {
            console.log(`  ${field}:`)
            console.log(`    source: ${JSON.stringify(diff.source[field])}`)
            console.log(`    target: ${JSON.stringify(diff.target[field])}`)
          }
        }
      }
    }

    if (!applyChanges) {
      console.log('\nDry-run only. Re-run with --apply to sync changes.')
      return
    }

    console.log('\nApplying changes...')

    if (heroDiff && sourceHero) {
      await target.configuracionSitio.upsert({
        where: { clave: 'hero_images' },
        create: {
          clave: sourceHero.clave,
          valor: sourceHero.valor,
          descripcion: sourceHero.descripcion,
          tipo: sourceHero.tipo,
          categoria: sourceHero.categoria,
        },
        update: {
          valor: sourceHero.valor,
          descripcion: sourceHero.descripcion,
          tipo: sourceHero.tipo,
          categoria: sourceHero.categoria,
          updatedAt: new Date(),
        },
      })
      console.log('  Updated: configuracion_sitio.hero_images')
    } else if (heroDiff && !sourceHero) {
      console.log('  Skipped hero_images: source does not have this config')
    }

    for (const diff of categoryDiffs) {
      const sourceCat = diff.source
      const result = await target.categoriaProyecto.updateMany({
        where: { key: sourceCat.key },
        data: {
          imagenCover: sourceCat.imagenCover,
          imagenBanner: sourceCat.imagenBanner,
          videoCover: sourceCat.videoCover,
          videoBanner: sourceCat.videoBanner,
          usarVideoCover: sourceCat.usarVideoCover,
          usarVideoBanner: sourceCat.usarVideoBanner,
          videoCoverPosition: sourceCat.videoCoverPosition,
          videoCoverScale: sourceCat.videoCoverScale,
          videoBannerPosition: sourceCat.videoBannerPosition,
          videoBannerScale: sourceCat.videoBannerScale,
          icono: sourceCat.icono,
          color: sourceCat.color,
          colorSecundario: sourceCat.colorSecundario,
          overlayColor: sourceCat.overlayColor,
          overlayOpacity: sourceCat.overlayOpacity,
          hoverOverlayColor: sourceCat.hoverOverlayColor,
          hoverOverlayOpacity: sourceCat.hoverOverlayOpacity,
          enableHoverOverlay: sourceCat.enableHoverOverlay,
          updatedAt: new Date(),
        },
      })

      if (result.count > 0) {
        console.log(`  Updated category: ${sourceCat.key}`)
      } else {
        console.log(`  Skipped category (not found): ${sourceCat.key}`)
      }
    }

    console.log('\nSync completed.')
  } catch (error) {
    console.error('\nSync failed:')
    console.error(error?.message || error)
    process.exitCode = 1
  } finally {
    await source.$disconnect()
    await target.$disconnect()
  }
}

run()
