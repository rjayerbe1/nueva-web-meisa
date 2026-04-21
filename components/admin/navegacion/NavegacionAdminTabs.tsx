"use client"

import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import type { MenuItem, FooterLink, SocialLink } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

interface Props {
  menuItems: MenuItem[]
  footerLinks: FooterLink[]
  socialLinks: SocialLink[]
}

const menuFields: FieldDef[] = [
  { name: "label", label: "Etiqueta", kind: "text", required: true },
  { name: "href", label: "URL", kind: "text", required: true, placeholder: "/proyectos" },
  { name: "imagen", label: "URL imagen (opcional)", kind: "url", gridSpan: 2 },
  {
    name: "target",
    label: "Target",
    kind: "text",
    placeholder: "_blank (opcional)",
  },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const footerFields: FieldDef[] = [
  {
    name: "grupo",
    label: "Grupo",
    kind: "select",
    required: true,
    options: [
      { value: "servicios", label: "Servicios" },
      { value: "empresa", label: "Empresa" },
      { value: "legal", label: "Legal" },
      { value: "recursos", label: "Recursos" },
    ],
  },
  { name: "label", label: "Etiqueta", kind: "text", required: true },
  { name: "href", label: "URL", kind: "text", required: true },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const socialFields: FieldDef[] = [
  {
    name: "red",
    label: "Red (única)",
    kind: "text",
    required: true,
    placeholder: "linkedin | instagram | facebook",
  },
  { name: "url", label: "URL", kind: "text", required: true, gridSpan: 2 },
  { name: "label", label: "Etiqueta (opcional)", kind: "text" },
  { name: "icono", label: "Icono (nombre)", kind: "text" },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

export function NavegacionAdminTabs({ menuItems, footerLinks, socialLinks }: Props) {
  return (
    <AdminTabsLayout
      title="Navegación"
      description="Menú principal, enlaces de footer y redes sociales del sitio."
      tabs={[
        {
          id: "menu",
          label: "Menú principal",
          count: menuItems.length,
          content: (
            <ListCrudEditor<MenuItem>
              items={menuItems}
              fields={menuFields}
              endpoint="/api/admin/menu"
              emptyTemplate={{
                label: "",
                href: "",
                imagen: null,
                target: null,
                orden: menuItems.length,
                activo: true,
              }}
              addLabel="Agregar ítem"
              renderPreview={(m) => (
                <div>
                  <div className="font-medium text-gray-900">{m.label}</div>
                  <div className="font-mono text-xs text-gray-500">
                    {m.href}
                    {m.target && <span className="ml-2 text-gray-400">[{m.target}]</span>}
                  </div>
                </div>
              )}
            />
          ),
        },
        {
          id: "footer",
          label: "Footer",
          count: footerLinks.length,
          content: (
            <ListCrudEditor<FooterLink>
              items={footerLinks}
              fields={footerFields}
              endpoint="/api/admin/footer-links"
              emptyTemplate={{
                grupo: "servicios",
                label: "",
                href: "",
                orden: 0,
                activo: true,
              }}
              addLabel="Agregar enlace"
              renderPreview={(f) => (
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {f.grupo}
                    </Badge>
                    <span className="font-medium text-gray-900">{f.label}</span>
                  </div>
                  <div className="font-mono text-xs text-gray-500">{f.href}</div>
                </div>
              )}
            />
          ),
        },
        {
          id: "redes",
          label: "Redes sociales",
          count: socialLinks.length,
          content: (
            <ListCrudEditor<SocialLink>
              items={socialLinks}
              fields={socialFields}
              endpoint="/api/admin/social-links"
              emptyTemplate={{
                red: "",
                url: "",
                label: null,
                icono: null,
                orden: socialLinks.length,
                activo: true,
              }}
              addLabel="Agregar red"
              renderPreview={(s) => (
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {s.red}
                    </Badge>
                    {s.label && <span className="text-sm text-gray-700">{s.label}</span>}
                  </div>
                  <div className="line-clamp-1 font-mono text-xs text-gray-500">{s.url}</div>
                </div>
              )}
            />
          ),
        },
      ]}
    />
  )
}
