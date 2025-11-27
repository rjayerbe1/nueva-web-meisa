'use client'

import { motion } from 'framer-motion'
import { Shield, Leaf, Award, FileText, CheckCircle, ExternalLink } from 'lucide-react'
import { SAFETY_CONTENT, SUSTAINABILITY_CONTENT, CERTIFICATIONS, STANDARDS_COMPLIANCE, CORPORATE_DOCUMENTS } from '@/lib/company-data'

export function CompromisoSection() {
  const rucCert = CERTIFICATIONS[0]

  return (
    <section id="compromiso" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestro <span className="text-blue-600">Compromiso</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Seguridad, sostenibilidad y cumplimiento normativo en cada proyecto
          </p>
        </motion.div>

        {/* Layout de 3 columnas */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Columna 1: Seguridad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">{SAFETY_CONTENT.title}</h3>
            </div>
            <ul className="space-y-2">
              {SAFETY_CONTENT.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-blue-600 font-semibold text-sm mt-4">
              {SAFETY_CONTENT.goal}
            </p>
          </motion.div>

          {/* Columna 2: Sostenibilidad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">{SUSTAINABILITY_CONTENT.title}</h3>
            </div>
            <ul className="space-y-2">
              {SUSTAINABILITY_CONTENT.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-green-600 font-semibold text-sm mt-4">
              {SUSTAINABILITY_CONTENT.commitment}
            </p>
          </motion.div>

          {/* Columna 3: Certificación y Normas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Certificación y Normas</h3>
            </div>

            {/* RUC */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={rucCert.logo}
                alt="Logo RUC"
                className="h-10 object-contain"
              />
              <div>
                <p className="text-gray-700 text-sm font-medium">{rucCert.fullName}</p>
                <p className="text-gray-500 text-xs">{rucCert.issuer}</p>
              </div>
            </div>

            {/* Normas */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Normas que cumplimos</p>
              <div className="flex flex-wrap gap-2">
                {STANDARDS_COMPLIANCE.map((norm) => (
                  <span
                    key={norm.name}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {norm.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Documentos */}
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Documentos corporativos</p>
              <div className="space-y-1">
                {CORPORATE_DOCUMENTS.map((doc) => (
                  <a
                    key={doc.name}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="group-hover:underline">{doc.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
