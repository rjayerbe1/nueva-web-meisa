"use client"

import { useState } from "react"
import { AnimatedSection } from "@/components/animations/AnimatedSection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const ubicaciones = [
  {
    ciudad: "Popayán - Oficina Principal",
    direccion: "Popayán, Cauca",
    telefono: "+57 (2) 312 0050",
    email: "contacto@meisa.com.co",
    horario: "Lun-Vie: 7:00 AM - 5:00 PM"
  },
  {
    ciudad: "Jamundí - Planta de Producción",
    direccion: "Jamundí, Valle del Cauca",
    telefono: "+57 (2) 312 0050",
    email: "contacto@meisa.com.co",
    horario: "Lun-Vie: 7:00 AM - 5:00 PM"
  },
  {
    ciudad: "Villa Rica - Planta de Producción",
    direccion: "Villa Rica, Cauca",
    telefono: "+57 (2) 312 0050",
    email: "contacto@meisa.com.co",
    horario: "Lun-Vie: 7:00 AM - 5:00 PM"
  }
]

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    servicio: "",
    mensaje: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSuccess(true)
    
    // Reset form
    setTimeout(() => {
      setFormData({
        nombre: "",
        empresa: "",
        email: "",
        telefono: "",
        servicio: "",
        mensaje: ""
      })
      setIsSuccess(false)
    }, 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contáctanos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos listos para ayudarte con tu proyecto. Contáctanos y un experto 
              de nuestro equipo te asesorará de manera personalizada.
            </p>
          </div>
        </AnimatedSection>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulario */}
          <AnimatedSection direction="left">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Envíanos un mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      ¡Mensaje enviado!
                    </h3>
                    <p className="text-gray-600">
                      Nos pondremos en contacto contigo pronto.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nombre">Nombre completo *</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="empresa">Empresa</Label>
                        <Input
                          id="empresa"
                          name="empresa"
                          value={formData.empresa}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="servicio">Servicio de interés</Label>
                      <Select
                        value={formData.servicio}
                        onValueChange={(value) => setFormData({ ...formData, servicio: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diseno">Diseño Estructural</SelectItem>
                          <SelectItem value="fabricacion">Fabricación</SelectItem>
                          <SelectItem value="montaje">Montaje</SelectItem>
                          <SelectItem value="consultoria">Consultoría</SelectItem>
                          <SelectItem value="proyecto-completo">Proyecto Completo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="mensaje">Mensaje *</Label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Cuéntanos sobre tu proyecto..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          Enviar mensaje
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Información de contacto */}
          <div className="space-y-8">
            <AnimatedSection direction="right">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Información de contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-meisa-blue mt-1" />
                    <div>
                      <p className="font-semibold">Teléfono Principal</p>
                      <p className="text-gray-600">+57 (2) 312 0050</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-meisa-blue mt-1" />
                    <div>
                      <p className="font-semibold">Email general</p>
                      <p className="text-gray-600">contacto@meisa.com.co</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-meisa-blue mt-1" />
                    <div>
                      <p className="font-semibold">Horario de atención</p>
                      <p className="text-gray-600">Lunes a Viernes: 7:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Oficinas */}
            <AnimatedSection direction="right" delay={0.2}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Nuestras ubicaciones
              </h3>
              <div className="space-y-4">
                {ubicaciones.map((ubicacion, index) => (
                  <motion.div
                    key={ubicacion.ciudad}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-lg text-gray-900 mb-3">
                          {ubicacion.ciudad}
                        </h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5" />
                            {ubicacion.direccion}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {ubicacion.telefono}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {ubicacion.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {ubicacion.horario}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Mapa */}
        <AnimatedSection delay={0.5}>
          <div className="mt-16">
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.5346159785724!2d-74.04950052412564!3d4.676206495306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a921c9d4b6b%3A0x5f9c4e1c82a04a5e!2sCalle%20100%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1703024400000!5m2!1ses!2sco"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Card>
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}