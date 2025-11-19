'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Phone, MapPin, Mail, Check } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const contactoDemo = {
  nombre: 'MEISA',
  cargo: 'Atención Comercial',
  telefono: '+57 310 432 7227'
}

const config = {
  tituloWidget: 'Háblanos por WhatsApp',
  mensajeIntroduccion: 'Elije la persona disponible para iniciar una conversación',
  horarioAtencion: 'Lunes a Viernes: 7:00 AM - 5:00 PM | Sábados: 8:00 AM - 12:00 PM'
}

export default function WhatsAppDemosPage() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bebas text-gray-900 mb-4">
            Elige el diseño del Widget de WhatsApp
          </h1>
          <p className="text-gray-600 font-lato text-lg">
            Selecciona el estilo que más te guste. Haz clic en cualquier opción para marcarla.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Opción 1: Minimalista Moderno */}
          <div
            onClick={() => setSelected(1)}
            className={`cursor-pointer transition-all ${selected === 1 ? 'ring-4 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Opción 1: Minimalista Moderno</h3>
                {selected === 1 && <Check className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm">
              {/* Header minimalista */}
              <div className="bg-white px-6 py-5 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {config.tituloWidget}
                </h3>
                <p className="text-sm text-gray-600">
                  {config.mensajeIntroduccion}
                </p>
              </div>

              {/* Horario */}
              <div className="px-6 py-3 bg-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>Lun-Vie: 7AM - 5PM</span>
                </div>
              </div>

              {/* Contacto */}
              <div className="p-6">
                <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                  <Avatar className="h-12 w-12 bg-blue-100 text-blue-700">
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">{contactoDemo.nombre}</p>
                    <p className="text-xs text-gray-600">{contactoDemo.cargo}</p>
                    <p className="text-xs text-gray-500">{contactoDemo.telefono}</p>
                  </div>
                  <div className="bg-green-500 p-2 rounded-full">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Opción 2: Card Elevado */}
          <div
            onClick={() => setSelected(2)}
            className={`cursor-pointer transition-all ${selected === 2 ? 'ring-4 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Opción 2: Card Elevado</h3>
                {selected === 2 && <Check className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden max-w-sm">
              {/* Header con sombra interna */}
              <div className="bg-white px-6 py-6 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  💬 WhatsApp
                </h3>
                <p className="text-sm text-gray-600">
                  Estamos listos para atenderte
                </p>
              </div>

              {/* Contacto con card interno */}
              <div className="p-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-14 w-14 bg-gradient-to-br from-green-400 to-green-600 text-white">
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{contactoDemo.nombre}</p>
                      <p className="text-xs text-gray-600">{contactoDemo.cargo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <Phone className="w-3 h-3" />
                    <span>{contactoDemo.telefono}</span>
                  </div>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold text-sm">
                    Iniciar Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Opción 3: Degradado Vibrante */}
          <div
            onClick={() => setSelected(3)}
            className={`cursor-pointer transition-all ${selected === 3 ? 'ring-4 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Opción 3: Degradado Vibrante</h3>
                {selected === 3 && <Check className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm">
              {/* Header con degradado llamativo */}
              <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 px-6 py-6 text-white">
                <h3 className="text-xl font-bold mb-1">
                  Contáctanos
                </h3>
                <p className="text-sm text-green-50">
                  Respuesta inmediata por WhatsApp
                </p>
              </div>

              {/* Contacto */}
              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 bg-white shadow-md border-2 border-green-200">
                      <AvatarFallback className="text-green-700">ME</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{contactoDemo.nombre}</p>
                      <p className="text-xs text-gray-600">{contactoDemo.cargo}</p>
                      <p className="text-xs text-green-600 font-semibold">{contactoDemo.telefono}</p>
                    </div>
                    <div className="bg-green-500 p-3 rounded-full shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opción 4: Glassmorphism */}
          <div
            onClick={() => setSelected(4)}
            className={`cursor-pointer transition-all ${selected === 4 ? 'ring-4 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Opción 4: Glassmorphism</h3>
                {selected === 4 && <Check className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-2xl overflow-hidden max-w-sm">
              {/* Backdrop blur effect */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md"></div>

              <div className="relative">
                {/* Header glass */}
                <div className="bg-white/60 backdrop-blur-lg px-6 py-6 border-b border-white/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Conversemos
                  </h3>
                  <p className="text-sm text-gray-700">
                    Te respondemos al instante
                  </p>
                </div>

                {/* Contacto */}
                <div className="p-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
                        <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{contactoDemo.nombre}</p>
                        <p className="text-xs text-gray-700">{contactoDemo.cargo}</p>
                        <p className="text-xs text-gray-600">{contactoDemo.telefono}</p>
                      </div>
                      <div className="bg-green-500 p-2.5 rounded-full shadow-lg">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opción 5: Neomorphism */}
          <div
            onClick={() => setSelected(5)}
            className={`cursor-pointer transition-all ${selected === 5 ? 'ring-4 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Opción 5: Neomorphism</h3>
                {selected === 5 && <Check className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <div className="bg-gray-100 rounded-3xl shadow-2xl overflow-hidden max-w-sm">
              {/* Header neumórfico */}
              <div className="bg-gray-100 px-6 py-6" style={{
                boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff'
              }}>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {config.tituloWidget}
                </h3>
                <p className="text-sm text-gray-600">
                  Chat en vivo
                </p>
              </div>

              {/* Contacto neumórfico */}
              <div className="p-6">
                <div className="bg-gray-100 rounded-2xl p-4" style={{
                  boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff'
                }}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold" style={{
                      boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff'
                    }}>
                      ME
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{contactoDemo.nombre}</p>
                      <p className="text-xs text-gray-600">{contactoDemo.cargo}</p>
                      <p className="text-xs text-gray-500">{contactoDemo.telefono}</p>
                    </div>
                    <div className="bg-green-500 p-2 rounded-full">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opción 6: Bordes Neon */}
          <div
            onClick={() => setSelected(6)}
            className={`cursor-pointer transition-all ${selected === 6 ? 'ring-4 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Opción 6: Bordes Neon</h3>
                {selected === 6 && <Check className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-w-sm border-2 border-green-400" style={{
              boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)'
            }}>
              {/* Header oscuro con neon */}
              <div className="bg-gray-800 px-6 py-6 border-b border-green-400/30">
                <h3 className="text-xl font-bold text-white mb-1">
                  {config.tituloWidget}
                </h3>
                <p className="text-sm text-gray-300">
                  Soporte en línea 24/7
                </p>
              </div>

              {/* Contacto */}
              <div className="p-6">
                <div className="bg-gray-800 rounded-2xl p-4 border border-green-400/50" style={{
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
                }}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 bg-green-500 text-white border-2 border-green-400">
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-white">{contactoDemo.nombre}</p>
                      <p className="text-xs text-gray-300">{contactoDemo.cargo}</p>
                      <p className="text-xs text-green-400">{contactoDemo.telefono}</p>
                    </div>
                    <div className="bg-green-500 p-2 rounded-full" style={{
                      boxShadow: '0 0 15px rgba(34, 197, 94, 0.8)'
                    }}>
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opción 7: Material Design 3 */}
          <div
            onClick={() => setSelected(7)}
            className={`cursor-pointer transition-all ${selected === 7 ? 'ring-4 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Opción 7: Material Design 3</h3>
                {selected === 7 && <Check className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-sm">
              {/* Header Material */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">WhatsApp</h3>
                    <p className="text-sm text-blue-100">Asistencia instantánea</p>
                  </div>
                </div>
              </div>

              {/* Contacto Material */}
              <div className="p-6">
                <div className="bg-blue-50 rounded-2xl p-5 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 bg-blue-600 text-white">
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">{contactoDemo.nombre}</p>
                      <p className="text-xs text-gray-600 mb-1">{contactoDemo.cargo}</p>
                      <p className="text-xs text-blue-600 font-medium">{contactoDemo.telefono}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opción 8: Minimalista Elegante */}
          <div
            onClick={() => setSelected(8)}
            className={`cursor-pointer transition-all ${selected === 8 ? 'ring-4 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Opción 8: Minimalista Elegante</h3>
                {selected === 8 && <Check className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm border border-gray-200">
              {/* Header simple */}
              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Contacto Directo</p>
                <h3 className="text-2xl font-light text-gray-900">
                  WhatsApp
                </h3>
              </div>

              {/* Contacto minimalista */}
              <div className="p-6">
                <div className="flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg px-4">
                  <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-medium text-sm">
                    ME
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{contactoDemo.nombre}</p>
                    <p className="text-sm text-gray-500">{contactoDemo.cargo}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{contactoDemo.telefono}</p>
                  </div>
                  <div className="text-green-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opción 9: Tarjeta con Sombras Suaves */}
          <div
            onClick={() => setSelected(9)}
            className={`cursor-pointer transition-all ${selected === 9 ? 'ring-4 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Opción 9: Sombras Suaves</h3>
                {selected === 9 && <Check className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <div className="bg-white rounded-3xl overflow-hidden max-w-sm" style={{
              boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.15)'
            }}>
              {/* Header con icono grande */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Chat con nosotros
                </h3>
                <p className="text-sm text-gray-600">
                  Estamos en línea
                </p>
              </div>

              {/* Contacto */}
              <div className="p-6">
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12 bg-blue-600 text-white">
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{contactoDemo.nombre}</p>
                      <p className="text-xs text-gray-600">{contactoDemo.cargo}</p>
                    </div>
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">{contactoDemo.telefono}</div>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
                    Enviar Mensaje
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Opción 10: Clean & Professional */}
          <div
            onClick={() => setSelected(10)}
            className={`cursor-pointer transition-all ${selected === 10 ? 'ring-4 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Opción 10: Clean & Professional</h3>
                {selected === 10 && <Check className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm border border-gray-200">
              {/* Header profesional */}
              <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    Atención Inmediata
                  </h3>
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">En línea</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Respuesta garantizada en menos de 5 minutos
                </p>
              </div>

              {/* Info y contacto */}
              <div className="p-6 space-y-4">
                {/* Info rápida */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-700">Lun-Vie</p>
                    <p className="text-xs font-semibold text-gray-900">7AM-5PM</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <Phone className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-700">Disponible</p>
                    <p className="text-xs font-semibold text-gray-900">Ahora</p>
                  </div>
                </div>

                {/* Contacto */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                      ME
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{contactoDemo.nombre}</p>
                      <p className="text-xs text-green-100">{contactoDemo.cargo}</p>
                    </div>
                  </div>
                  <div className="text-xs text-green-100 mb-3">{contactoDemo.telefono}</div>
                  <button className="w-full bg-white text-green-600 py-2 rounded-lg font-bold text-sm hover:bg-green-50 transition-colors">
                    Iniciar Conversación →
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Resultado de selección */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center bg-white rounded-2xl shadow-lg p-8"
          >
            <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Has seleccionado la Opción {selected}
            </h2>
            <p className="text-gray-600 mb-6">
              Este será el diseño de tu widget de WhatsApp
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(selected.toString())
                alert(`Opción ${selected} copiada al portapapeles. Indica este número para implementarlo.`)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Confirmar Opción {selected}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
