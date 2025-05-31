#!/usr/bin/env ts-node

/**
 * Comprehensive mapping of FTP backup images to expected database naming
 * Based on exploration of wordpress-ftp-backup-20250528-085630/wp-content/uploads/
 */

import * as fs from 'fs';
import * as path from 'path';

const FTP_UPLOADS_PATH = "/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/wordpress-ftp-backup-20250528-085630/wp-content/uploads";

const TARGET_IMAGES_DIR = "/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/nueva-web-meisa/public/images/projects";

interface ProjectImageMapping {
  expectedName: string;
  ftpPath: string;
  actualName: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

// High-priority projects found in database analysis
const HIGH_PRIORITY_PROJECTS = [
  'Centro-campanario',
  'Centro-monserrat', 
  'Edificio-cinemateca-distrital',
  'Edificio-clinica-reina-victoria',
  'Puente-vehicular-nolasco',
  'Complejo-Industrial-Piedechinche'
];

// Project name mappings from FTP structure to expected database names
const PROJECT_MAPPINGS: Record<string, {
  expectedName: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}> = {
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

async function findProjectImages(): Promise<ProjectImageMapping[]> {
  const mappings: ProjectImageMapping[] = [];

  // Function to recursively search for images
  function searchDirectory(dir: string) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        searchDirectory(fullPath);
      } else if (file.endsWith('.webp') && !file.includes('-150x150') && !file.includes('-300x')) {
        // Look for base image files (not thumbnails)
        const baseNameMatch = file.match(/^([A-Z][^-]*(?:-[^-]*)*?)(?:-\d+)?\.(webp)$/);
        if (baseNameMatch) {
          const baseName = baseNameMatch[1];
          
          // Check if this matches any of our project mappings
          for (const [ftpPattern, mapping] of Object.entries(PROJECT_MAPPINGS)) {
            if (baseName.startsWith(ftpPattern) || baseName === ftpPattern) {
              // Look for the base image without size suffixes
              const baseImageName = file.replace(/-\d+x\d+/, '').replace(/-scaled/, '');
              
              mappings.push({
                expectedName: mapping.expectedName,
                ftpPath: fullPath,
                actualName: file,
                category: mapping.category,
                priority: mapping.priority
              });
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

async function generateCopyScript(mappings: ProjectImageMapping[]): Promise<void> {
  // Group by expected name and get the best image for each
  const projectImages = new Map<string, ProjectImageMapping>();

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
  const scriptPath = '/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/nueva-web-meisa/copy-ftp-project-images.sh';
  fs.writeFileSync(scriptPath, script);
  fs.chmodSync(scriptPath, '755');

  console.log(`📝 Generated copy script: ${scriptPath}`);
}

async function generateMappingReport(mappings: ProjectImageMapping[]): Promise<void> {
  // Group by expected name
  const grouped = new Map<string, ProjectImageMapping[]>();
  for (const mapping of mappings) {
    if (!grouped.has(mapping.expectedName)) {
      grouped.set(mapping.expectedName, []);
    }
    grouped.get(mapping.expectedName)!.push(mapping);
  }

  let report = `# FTP Project Images Mapping Report
Generated: ${new Date().toISOString()}

## Summary
- Total unique projects found: ${grouped.size}
- Total image variants: ${mappings.length}
- High priority projects: ${Array.from(grouped.values()).filter(group => group[0].priority === 'high').length}

## Project Categories

`;

  // Group by category
  const categories = new Map<string, ProjectImageMapping[]>();
  for (const mapping of mappings) {
    if (!categories.has(mapping.category)) {
      categories.set(mapping.category, []);
    }
    categories.get(mapping.category)!.push(mapping);
  }

  Array.from(categories.entries()).forEach(([category, categoryMappings]) => {
    const uniqueProjects = new Set(categoryMappings.map((m: ProjectImageMapping) => m.expectedName));
    report += `### ${category.toUpperCase()} (${uniqueProjects.size} projects)\n\n`;
    
    Array.from(uniqueProjects).forEach((projectName: string) => {
      const projectMappings = categoryMappings.filter((m: ProjectImageMapping) => m.expectedName === projectName);
      const priority = projectMappings[0].priority;
      const priorityIcon = priority === 'high' ? '🔥' : priority === 'medium' ? '⭐' : '📝';
      
      report += `${priorityIcon} **${projectName}** (${priority} priority)\n`;
      report += `   - Variants found: ${projectMappings.length}\n`;
      report += `   - Sample path: ${projectMappings[0].ftpPath.replace(FTP_UPLOADS_PATH, '...')}\n\n`;
    });
  });

  report += `\n## Detailed File Mappings\n\n`;

  Array.from(grouped.entries()).forEach(([projectName, projectMappings]) => {
    report += `### ${projectName}\n\n`;
    report += `| Actual File | Size Variant | FTP Path |\n`;
    report += `|-------------|--------------|----------|\n`;
    
    projectMappings.slice(0, 5).forEach((mapping: ProjectImageMapping) => { // Show max 5 per project
      const sizePart = mapping.actualName.match(/-(\d+x\d+)/)?.[1] || 'original';
      const shortPath = mapping.ftpPath.replace(FTP_UPLOADS_PATH, '...');
      report += `| ${mapping.actualName} | ${sizePart} | ${shortPath} |\n`;
    });
    
    if (projectMappings.length > 5) {
      report += `| ... | ... | *${projectMappings.length - 5} more variants* |\n`;
    }
    
    report += `\n`;
  });

  // Write report
  const reportPath = '/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/nueva-web-meisa/FTP-PROJECT-IMAGES-MAPPING.md';
  fs.writeFileSync(reportPath, report);

  console.log(`📊 Generated mapping report: ${reportPath}`);
}

async function main() {
  console.log('🔍 Scanning FTP backup for project images...');
  console.log(`📁 Scanning: ${FTP_UPLOADS_PATH}`);
  
  const mappings = await findProjectImages();
  
  console.log(`✅ Found ${mappings.length} image variants across ${new Set(mappings.map(m => m.expectedName)).size} projects`);
  
  await generateCopyScript(mappings);
  await generateMappingReport(mappings);
  
  console.log('\n🎯 Next steps:');
  console.log('1. Review the generated mapping report: FTP-PROJECT-IMAGES-MAPPING.md');
  console.log('2. Run the copy script: ./copy-ftp-project-images.sh');
  console.log('3. Verify images in public/images/projects/');
}

if (require.main === module) {
  main().catch(console.error);
}