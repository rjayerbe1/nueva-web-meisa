'use client'

import { motion } from 'framer-motion'
import { Shield, Leaf, Award, FileText, CheckCircle, ExternalLink, Scale, BadgeCheck } from 'lucide-react'
import { SAFETY_CONTENT, SUSTAINABILITY_CONTENT, CERTIFICATIONS, STANDARDS_COMPLIANCE, CORPORATE_DOCUMENTS } from '@/lib/company-data'

export function CompromisoSection() {
  const rucCert = CERTIFICATIONS[0] // La certificación RUC

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

        {/* Grid de 3 columnas */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Seguridad */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 shadow-lg h-full"
          >
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {SAFETY_CONTENT.title}
            </h3>
            <p className="text-blue-600 font-medium mb-6">
              {SAFETY_CONTENT.subtitle}
            </p>

            <ul className="space-y-3 mb-6">
              {SAFETY_CONTENT.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4 border-t border-blue-100">
              <p className="text-blue-700 font-bold text-sm">
                {SAFETY_CONTENT.goal}
              </p>
            </div>
          </motion.div>

          {/* Sostenibilidad */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-100 shadow-lg h-full"
          >
            <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {SUSTAINABILITY_CONTENT.title}
            </h3>
            <p className="text-green-600 font-medium mb-6">
              {SUSTAINABILITY_CONTENT.subtitle}
            </p>

            <ul className="space-y-3 mb-6">
              {SUSTAINABILITY_CONTENT.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4 border-t border-green-100">
              <p className="text-green-700 font-bold text-sm">
                {SUSTAINABILITY_CONTENT.commitment}
              </p>
            </div>
          </motion.div>

          {/* Certificación y Normas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-100 shadow-lg h-full"
          >
            <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Certificación y Normas
            </h3>
            <p className="text-slate-600 font-medium mb-6">
              Cumplimiento de estándares nacionales e internacionales
            </p>

            {/* Certificación RUC destacada */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-5 shadow-lg border-2 border-blue-200 mb-6"
            >
              <div className="flex justify-center mb-3">
                <img
                  src={rucCert.logo}
                  alt="Logo RUC - Registro Uniforme de Contratistas"
                  className="h-16 object-contain"
                />
              </div>
              <p className="text-gray-600 text-sm text-center mb-2">{rucCert.description}</p>
              <p className="text-xs text-gray-500 text-center">
                <span className="font-medium">Otorgado por:</span> {rucCert.issuer}
              </p>
            </motion.div>

            {/* Normas que cumplimos */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Normas que cumplimos</p>
              <div className="flex flex-wrap gap-2">
                {STANDARDS_COMPLIANCE.map((norm) => (
                  <span
                    key={norm.name}
                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium"
                  >
                    <Scale className="w-3 h-3" />
                    {norm.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Documentos corporativos */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Documentos</p>
              <div className="space-y-1.5">
                {CORPORATE_DOCUMENTS.map((doc) => (
                  <a
                    key={doc.name}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <FileText className="w-3.5 h-3.5" />
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
