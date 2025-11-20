#!/usr/bin/env python3
import re

# Read the original file
with open('components/admin/CategoryEditModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the visual tab section
visual_tab_pattern = r'(\s+{/\* Tab: Aspecto Visual \*/}\s+{activeTab === \'visual\' && \(\s+<div className="space-y-\d+">\s*)'
visual_tab_end_pattern = r'(\s+</div>\s+\)}\s+{/\* Tab: SEO \*/})'

# Extract everything before visual tab
before_match = re.search(visual_tab_pattern, content)
if not before_match:
    print("Could not find visual tab start")
    exit(1)

before_visual = content[:before_match.start()]
visual_indent = before_match.group(1)

# Extract everything after visual tab
after_match = re.search(visual_tab_end_pattern, content[before_match.end():])
if not after_match:
    print("Could not find visual tab end")
    exit(1)

after_visual_start = before_match.end() + after_match.start()
after_visual = content[after_visual_start:]

# Extract sections from current content for reuse
icon_section_start = content.find('{/* Selección de Icono */}')
icon_section_end = content.find('{/* Tamaño del Icono */}')
icon_section = content[icon_section_start:icon_section_end].strip() if icon_section_start != -1 else ""

icon_size_start = icon_section_end
icon_size_end = content.find('{/* Colores */}')
icon_size_section = content[icon_size_start:icon_size_end].strip() if icon_size_start != -1 else ""

colors_start = icon_size_end
colors_end = content.find('</div>\n            )}\n\n            {/* Tab: SEO */')
# Find the actual end of colors section
colors_content_match = re.search(r'({/\* Colores \*/}.*?)</div>\s+</div>\s+\)}\s+{/\* Tab: SEO', content[colors_start:], re.DOTALL)
colors_section = colors_content_match.group(1).strip() if colors_content_match else ""

# Build new visual tab with accordions
new_visual_tab = f'''{visual_indent}

                {{/* Sección 1: Iconografía y Colores */}}
                <AccordionSection
                  title="Iconografía y Colores"
                  icon="🎨"
                  defaultOpen={{true}}
                  statusIndicator={{
                    <span className="text-xs">
                      {{formData.icono ? '✓ Configurado' : '○ Pendiente'}}
                    </span>
                  }}
                >
                  <div className="space-y-6">
                    {icon_section}

                    {icon_size_section}

                    {colors_section}
                  </div>
                </AccordionSection>

                {{/* Sección 2: Medios de Portada (Card) */}}
                <AccordionSection
                  title="Medios de Portada (Card)"
                  icon="📸"
                  defaultOpen={{false}}
                  statusIndicator={{
                    <span className="text-xs">
                      {{formData.imagenCover && '✓ Imagen'}} {{formData.videoCover && '| ✓ Video'}}
                      {{!formData.imagenCover && !formData.videoCover && '○ Sin medios'}}
                    </span>
                  }}
                >
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      Los medios de portada se muestran en las tarjetas de categoría en la página principal.
                    </p>
                    <p className="text-sm text-gray-500">
                      Contenido de imagen y video de portada - A completar
                    </p>
                  </div>
                </AccordionSection>

                {{/* Sección 3: Medios de Hero (Banner) */}}
                <AccordionSection
                  title="Medios de Hero (Banner)"
                  icon="🖼️"
                  defaultOpen={{false}}
                  statusIndicator={{
                    <span className="text-xs">
                      {{formData.imagenBanner && '✓ Banner'}} {{formData.videoBanner && '| ✓ Video'}}
                      {{!formData.imagenBanner && !formData.videoBanner && '○ Sin medios'}}
                    </span>
                  }}
                >
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      El banner se muestra en la parte superior de la página dedicada de la categoría.
                    </p>
                    <p className="text-sm text-gray-500">
                      Contenido de imagen y video de banner - A completar
                    </p>
                  </div>
                </AccordionSection>

                {{/* Sección 4: Efectos Visuales */}}
                <AccordionSection
                  title="Efectos Visuales"
                  icon="🎭"
                  defaultOpen={{false}}
                  statusIndicator={{
                    <span className="text-xs">
                      {{formData.overlayOpacity > 0 && '✓ Overlay activo'}}
                    </span>
                  }}
                >
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      Configura overlays y efectos visuales para las tarjetas de categoría.
                    </p>
                    <p className="text-sm text-gray-500">
                      Controles de overlay - A completar
                    </p>
                  </div>
                </AccordionSection>

'''

# Combine everything
new_content = before_visual + new_visual_tab + after_visual

# Write the new file
with open('components/admin/CategoryEditModal.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Visual tab reorganized successfully!")
print(f"   - Icon section: {len(icon_section)} chars")
print(f"   - Icon size section: {len(icon_size_section)} chars")
print(f"   - Colors section: {len(colors_section)} chars")
