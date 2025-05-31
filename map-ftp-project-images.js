#!/usr/bin/env node

/**
 * Comprehensive mapping of FTP backup images to expected database naming
 * Based on exploration of wordpress-ftp-backup-20250528-085630/wp-content/uploads/
 */

const fs = require('fs');
const path = require('path');

const FTP_UPLOADS_PATH = "/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/wordpress-ftp-backup-20250528-085630/wp-content/uploads";

const TARGET_IMAGES_DIR = "/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/nueva-web-meisa/public/images/projects";

// Project name mappings from FTP structure to expected database names
const PROJECT_MAPPINGS = {
  // Shopping Centers / Centros Comerciales
  'Centro-campanario': { expectedName: 'Centro-campanario', category: 'centros-comerciales', priority: 'high' },
  'Centro-monserrat': { expectedName: 'Centro-monserrat', category: 'centros-comerciales', priority: 'high' },
  'Centro-bochalema-plaza': { expectedName: 'Centro-bochalema-plaza', category: 'centros-comerciales', priority: 'medium' },
  'Centro-unico-cali': { expectedName: 'Centro-unico-cali', category: 'centros-comerciales', priority: 'medium' },
  'Centro-unico-barranquilla': { expectedName: 'Centro-unico-barranquilla', category: 'centros-comerciales', priority: 'medium' },
  'Centro-unico-neiva': { expectedName: 'Centro-unico-neiva', category: 'centros-comerciales', priority: 'medium' },
  'Centro-armenia-plaza': { expectedName: 'Centro-armenia-plaza', category: 'centros-comerciales', priority: 'medium' },
  'Centro-paseo-villa-del-rio': { expectedName: 'Centro-paseo-villa-del-rio', category: 'centros-comerciales', priority: 'medium' },
  'Unicentro-Cali': { expectedName: 'Unicentro-Cali', category: 'centros-comerciales', priority: 'medium' },

  // Buildings / Edificios  
  'Edificio-cinemateca-distrital': { expectedName: 'Edificio-cinemateca-distrital', category: 'edificios', priority: 'high' },
  'Edificio-clinica-reina-victoria': { expectedName: 'Edificio-clinica-reina-victoria', category: 'edificios', priority: 'high' },
  'Edificio-tequendama': { expectedName: 'Edificio-tequendama', category: 'edificios', priority: 'medium' },
  'Edificio-terminal': { expectedName: 'Edificio-terminal', category: 'edificios', priority: 'medium' },
  'Edificio-estacion': { expectedName: 'Edificio-estacion', category: 'edificios', priority: 'medium' },
  'Edificio-bomberos': { expectedName: 'Edificio-bomberos', category: 'edificios', priority: 'medium' },
  'Edificio-omega': { expectedName: 'Edificio-omega', category: 'edificios', priority: 'medium' },
  'Edificio-sena': { expectedName: 'Edificio-sena', category: 'edificios', priority: 'medium' },
  'Edificio-modulos': { expectedName: 'Edificio-modulos', category: 'edificios', priority: 'low' },

  // Bridges / Puentes
  'Puente-vehicular-nolasco': { expectedName: 'Puente-vehicular-nolasco', category: 'puentes-vehiculares', priority: 'high' },
  'Puente-vehicular-rio-negro': { expectedName: 'Puente-vehicular-rio-negro', category: 'puentes-vehiculares', priority: 'medium' },
  'Puente-vehicular-cambrin': { expectedName: 'Puente-vehicular-cambrin', category: 'puentes-vehiculares', priority: 'medium' },
  'Puente-vehicular-saraconcho': { expectedName: 'Puente-vehicular-saraconcho', category: 'puentes-vehiculares', priority: 'medium' },
  'Puente-vehicular-carrera-cien': { expectedName: 'Puente-vehicular-carrera-cien', category: 'puentes-vehiculares', priority: 'medium' },
  'Puente-vehicular-la-veinti-uno': { expectedName: 'Puente-vehicular-la-veinti-uno', category: 'puentes-vehiculares', priority: 'medium' },

  // Pedestrian Bridges / Puentes Peatonales  
  'Puente-peatonal-la-63-cali': { expectedName: 'Puente-peatonal-la-63-cali', category: 'puentes-peatonales', priority: 'medium' },
  'Puente-peatonal-terminal-intermedio': { expectedName: 'Puente-peatonal-terminal-intermedio', category: 'puentes-peatonales', priority: 'medium' },

  // Industry / Industria
  'Complejo-Industrial-Piedechinche': { expectedName: 'Complejo-Industrial-Piedechinche', category: 'industria', priority: 'high' },
  'Industria-bodega': { expectedName: 'Industria-bodega', category: 'industria', priority: 'medium' },
  'Industria-tecnofar': { expectedName: 'Industria-tecnofar', category: 'industria', priority: 'medium' },
  'Industria-tecno': { expectedName: 'Industria-tecno', category: 'industria', priority: 'medium' },
  'Industria-ampliacion': { expectedName: 'Industria-ampliacion', category: 'industria', priority: 'medium' },
  'Industria-torre': { expectedName: 'Industria-torre', category: 'industria', priority: 'medium' },
  'TECNOFAR': { expectedName: 'TECNOFAR', category: 'industria', priority: 'medium' },

  // Sports Venues / Escenarios Deportivos
  'Escenario-deportivo': { expectedName: 'Escenario-deportivo', category: 'escenarios-deportivos', priority: 'medium' },

  // Covers and Facades / Cubiertas y Fachadas
  'Cubiertas-y': { expectedName: 'Cubiertas-y-fachadas', category: 'cubiertas-y-fachadas', priority: 'medium' },

  // Modular Structures / Estructuras Modulares
  'Estructura-modular': { expectedName: 'Estructura-modular', category: 'estructuras-modulares', priority: 'low' },

  // Oil & Gas
  'Oil-gas': { expectedName: 'Oil-gas', category: 'oil-and-gas', priority: 'medium' },
};

function findProjectImages() {
  const mappings = [];

  // Function to recursively search for images
  function searchDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        searchDirectory(fullPath);
      } else if (file.endsWith('.webp')) {
        // Look for meaningful image files (prefer 600x403 size or original)
        const baseNameMatch = file.match(/^([A-Z][^-]*(?:-[^-]*)*?)(?:-\d+(?:x\d+)?)?(?:-scaled)?\.webp$/);
        if (baseNameMatch) {
          const baseName = baseNameMatch[1];
          
          // Check if this matches any of our project mappings
          for (const [ftpPattern, mapping] of Object.entries(PROJECT_MAPPINGS)) {
            if (baseName.startsWith(ftpPattern) || baseName === ftpPattern) {
              // Prefer 600x403 images or originals
              if (file.includes('-600x403') || !file.includes('-') || file.includes('-1.webp')) {
                mappings.push({
                  expectedName: mapping.expectedName,
                  ftpPath: fullPath,
                  actualName: file,
                  category: mapping.category,
                  priority: mapping.priority
                });
              }
              break;
            }
          }
        }
      }
    }
  }

  searchDirectory(FTP_UPLOADS_PATH);
  return mappings;
}

function generateCopyScript(mappings) {
  // Group by expected name and get the best image for each
  const projectImages = new Map();

  for (const mapping of mappings) {
    const existing = projectImages.get(mapping.expectedName);
    if (!existing || 
        mapping.priority === 'high' || 
        (existing.priority !== 'high' && mapping.actualName.includes('-600x403'))) {
      projectImages.set(mapping.expectedName, mapping);
    }
  }

  // Generate copy script
  const scriptContent = `#!/bin/bash

# Auto-generated script to copy project images from FTP backup
# Source: wordpress-ftp-backup-20250528-085630/wp-content/uploads/
# Target: nueva-web-meisa/public/images/projects/

echo "Starting project image copying process..."

# Create target directory if it doesn't exist
mkdir -p "${TARGET_IMAGES_DIR}"

# Copy high-priority images first
echo "Copying high-priority project images..."

`;

  const highPriorityImages = Array.from(projectImages.values()).filter(m => m.priority === 'high');
  const mediumPriorityImages = Array.from(projectImages.values()).filter(m => m.priority === 'medium');
  const lowPriorityImages = Array.from(projectImages.values()).filter(m => m.priority === 'low');

  let script = scriptContent;

  // Add high priority images
  for (const mapping of highPriorityImages) {
    const targetName = `${mapping.expectedName}-1.webp`;
    script += `cp "${mapping.ftpPath}" "${TARGET_IMAGES_DIR}/${targetName}"\n`;
    script += `echo "✅ Copied: ${mapping.expectedName}"\n\n`;
  }

  script += '\necho "Copying medium-priority project images..."\n\n';

  // Add medium priority images  
  for (const mapping of mediumPriorityImages) {
    const targetName = `${mapping.expectedName}-1.webp`;
    script += `cp "${mapping.ftpPath}" "${TARGET_IMAGES_DIR}/${targetName}"\n`;
    script += `echo "✅ Copied: ${mapping.expectedName}"\n\n`;
  }

  script += '\necho "Copying low-priority project images..."\n\n';

  // Add low priority images
  for (const mapping of lowPriorityImages) {
    const targetName = `${mapping.expectedName}-1.webp`;
    script += `cp "${mapping.ftpPath}" "${TARGET_IMAGES_DIR}/${targetName}"\n`;
    script += `echo "✅ Copied: ${mapping.expectedName}"\n\n`;
  }

  script += '\necho "✨ Project image copying completed!"\n';
  script += `echo "📁 Images copied to: ${TARGET_IMAGES_DIR}"\n`;
  script += `echo "📊 Total images: ${projectImages.size}"\n`;

  // Write script
  const scriptPath = path.join(__dirname, 'copy-ftp-project-images.sh');
  fs.writeFileSync(scriptPath, script);
  fs.chmodSync(scriptPath, '755');

  console.log(`📝 Generated copy script: ${scriptPath}`);
  return projectImages;
}

function generateMappingReport(mappings, projectImages) {
  let report = `# FTP Project Images Mapping Report
Generated: ${new Date().toISOString()}

## Summary
- Total unique projects found: ${projectImages.size}
- Total image variants scanned: ${mappings.length}
- High priority projects: ${Array.from(projectImages.values()).filter(m => m.priority === 'high').length}

## Selected Images for Copy

The following images have been selected for copying based on priority and quality:

`;

  // Sort by priority and name
  const sortedProjects = Array.from(projectImages.values()).sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.expectedName.localeCompare(b.expectedName);
  });

  for (const mapping of sortedProjects) {
    const priorityIcon = mapping.priority === 'high' ? '🔥' : mapping.priority === 'medium' ? '⭐' : '📝';
    report += `${priorityIcon} **${mapping.expectedName}** (${mapping.priority} priority)\n`;
    report += `   - Category: ${mapping.category}\n`;
    report += `   - Source: ${mapping.actualName}\n`;
    report += `   - Path: ${mapping.ftpPath.replace(FTP_UPLOADS_PATH, '...')}\n\n`;
  }

  // Group by category for summary
  const categories = new Map();
  for (const mapping of Array.from(projectImages.values())) {
    if (!categories.has(mapping.category)) {
      categories.set(mapping.category, []);
    }
    categories.get(mapping.category).push(mapping);
  }

  report += `\n## Category Summary\n\n`;

  for (const [category, categoryMappings] of categories) {
    report += `### ${category.toUpperCase().replace(/-/g, ' ')} (${categoryMappings.length} projects)\n\n`;
    for (const mapping of categoryMappings) {
      const priorityIcon = mapping.priority === 'high' ? '🔥' : mapping.priority === 'medium' ? '⭐' : '📝';
      report += `- ${priorityIcon} ${mapping.expectedName}\n`;
    }
    report += `\n`;
  }

  // Write report
  const reportPath = path.join(__dirname, 'FTP-PROJECT-IMAGES-MAPPING.md');
  fs.writeFileSync(reportPath, report);

  console.log(`📊 Generated mapping report: ${reportPath}`);
}

function main() {
  console.log('🔍 Scanning FTP backup for project images...');
  console.log(`📁 Scanning: ${FTP_UPLOADS_PATH}`);
  
  const mappings = findProjectImages();
  
  console.log(`✅ Found ${mappings.length} suitable image files`);
  
  const projectImages = generateCopyScript(mappings);
  generateMappingReport(mappings, projectImages);
  
  console.log(`📈 Selected ${projectImages.size} unique projects for copying`);
  console.log('\n🎯 Next steps:');
  console.log('1. Review the generated mapping report: FTP-PROJECT-IMAGES-MAPPING.md');
  console.log('2. Run the copy script: ./copy-ftp-project-images.sh');
  console.log('3. Verify images in public/images/projects/');
}

if (require.main === module) {
  main();
}