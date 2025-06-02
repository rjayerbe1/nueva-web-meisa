import { Metadata } from 'next'
import { QualityPageContent } from '@/components/sections/QualityPageContent'

export const metadata: Metadata = {
  title: 'Certificaciones MEISA - Sistema Integrado de Gestión SIG | Calidad',
  description: 'Certificaciones y calidad MEISA: Sistema Integrado de Gestión SIG, normas sismo resistentes NSR-10, políticas de seguridad, transparencia y ética empresarial.',
  keywords: ['SIG', 'Sistema Integrado de Gestión', 'NSR-10', 'normas sismo resistentes', 'certificaciones', 'calidad', 'seguridad', 'AWS', 'AISC'],
}

export default function QualityPage() {
  return <QualityPageContent />
}