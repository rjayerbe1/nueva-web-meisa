import fs from 'fs'
import path from 'path'

async function downloadAllSliderImages() {
  console.log('🎯 DESCARGANDO TODAS LAS IMÁGENES DE SLIDERS Y GALERÍAS...\n')

  // TODAS las imágenes adicionales encontradas en los sliders
  const allProjectsData = {
    // CENTROS COMERCIALES ADICIONALES
    'centro-paseo-villa-del-rio': {
      title: 'Paseo Villa del Río',
      location: 'Bogotá, Cundinamarca',
      client: 'Ménsula Ingenieros S.A',
      weight: '420 toneladas',
      description: 'Estructura, metálica de rampas, losa y racks',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-paseo-villa-del-rio-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-paseo-villa-del-rio-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-paseo-villa-del-rio-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-paseo-villa-del-rio-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-paseo-villa-del-rio-5-400x400.webp'
      ]
    },
    'centro-comercial-monserrat': {
      title: 'Centro Comercial Monserrat',
      location: 'Popayán, Cauca',
      client: 'Constructora Adriana Rivera SAS',
      weight: 'No especificado',
      description: 'Estructura Metálica y Cubierta',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-monserrat-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-monserrat-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-monserrat-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-monserrat-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-monserrat-5-400x400.webp'
      ]
    },
    'centro-comercial-unico-cali': {
      title: 'Centro Comercial Unico Cali',
      location: 'Cali, Valle',
      client: 'Unitres SAS',
      weight: '790 toneladas',
      description: 'Construcción de obra civil, estructura metálica y cubierta',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-cali-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-cali-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-cali-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-cali-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-cali-5-400x400.webp'
      ]
    },
    'centro-comercial-unico-neiva': {
      title: 'Centro Comercial Unico Neiva',
      location: 'Neiva, Huila',
      client: 'Constructora Colpatria SAS',
      weight: '902 toneladas',
      description: 'Estructura Metálica y Cubierta',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-neiva-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-neiva-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-neiva-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-neiva-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-neiva-5-400x400.webp'
      ]
    },
    'centro-comercial-unico-barranquilla': {
      title: 'Centro Comercial Unico Barranquilla',
      location: 'Barranquilla, Atlántico',
      client: 'Centros Comerciales de la Costa SAS',
      weight: 'No especificado',
      description: 'Estructura Metálica y Cubierta',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-barranquilla-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-barranquilla-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-unico-barranquilla-3-400x400.webp'
      ]
    },
    'centro-comercial-armenia-plaza': {
      title: 'Centro Comercial Armenia Plaza',
      location: 'Armenia, Quindío',
      client: 'ER Inversiones',
      weight: 'No especificado',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-armenia-plaza-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-armenia-plaza-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-armenia-plaza-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-armenia-plaza-4-400x400.webp'
      ]
    },
    'centro-comercial-bochalema-plaza': {
      title: 'Centro Comercial Bochalema Plaza',
      location: 'Cali, Valle del Cauca',
      client: 'Constructora Normandía',
      weight: '1,781 toneladas',
      description: 'Estructura metálica - Área: 16,347 metros cuadrados',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-bochalema-plaza-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-bochalema-plaza-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-bochalema-plaza-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-bochalema-plaza-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-bochalema-plaza-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-bochalema-plaza-6-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-bochalema-plaza-7-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-bochalema-plaza-8-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Centro-bochalema-plaza-9-400x400.webp'
      ]
    },

    // EDIFICIOS ADICIONALES
    'edificio-clinica-reina-victoria': {
      title: 'Clínica Reina Victoria',
      location: 'Popayán, Cauca',
      client: 'INVERSIONES M&L GROUP S.A.S.',
      weight: '815 toneladas',
      description: 'Cimentación y estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-clinica-reina-victoria-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-clinica-reina-victoria-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-clinica-reina-victoria-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-clinica-reina-victoria-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-clinica-reina-victoria-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-clinica-reina-victoria-6-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-clinica-reina-victoria-7-400x400.webp'
      ]
    },
    'edificio-omega': {
      title: 'Edificio Omega',
      location: 'Cali, Valle',
      client: 'Omega',
      weight: 'No especificado',
      description: 'Estructura Metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-omega-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-omega-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-omega-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-omega-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-omega-5-400x400.webp'
      ]
    },
    'edificio-bomberos-popayan': {
      title: 'Bomberos Popayán',
      location: 'Popayán, Cauca',
      client: 'Cuerpo de bomberos voluntarios de Popayán',
      weight: 'No especificado',
      description: 'Estructura Metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-bomberos-popayan-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-bomberos-popayan-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-bomberos-popayan-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-bomberos-popayan-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-bomberos-popayan-5-400x400.webp'
      ]
    },
    'edificio-estacion-mio-guadalupe': {
      title: 'Estación MIO Guadalupe',
      location: 'Cali, Valle',
      client: 'Consorcio Metrovial SB',
      weight: '654 toneladas',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-estacion-mio-guadalupe-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-estacion-mio-guadalupe-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-estacion-mio-guadalupe-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-estacion-mio-guadalupe-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-estacion-mio-guadalupe-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-estacion-mio-guadalupe-6-400x400.webp'
      ]
    },
    'edificio-sena-santander': {
      title: 'SENA Santander',
      location: 'Santander, Cauca',
      client: 'Sena',
      weight: 'No especificado',
      description: 'Estructura Metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-sena-santander-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-sena-santander-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-sena-santander-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-sena-santander-4-400x400.webp'
      ]
    },
    'edificio-terminal-intermedio-mio-cali': {
      title: 'Terminal Intermedio MIO',
      location: 'Cali, Valle del Cauca',
      client: 'Consorcio Metrovial SB',
      weight: '654 toneladas',
      description: 'Estructura metálica - Área: 8,842 metros cuadrados',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-terminal-intermedio-mio-cali-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-terminal-intermedio-mio-cali-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-terminal-intermedio-mio-cali-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-terminal-intermedio-mio-cali-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-terminal-intermedio-mio-cali-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-terminal-intermedio-mio-cali-6-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-terminal-intermedio-mio-cali-7-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-terminal-intermedio-mio-cali-8-400x400.webp'
      ]
    },
    'edificio-tequendama-parking-cali': {
      title: 'Tequendama Parking Cali',
      location: 'Cali, Valle del Cauca',
      client: 'No especificado',
      weight: '156 toneladas',
      description: 'Estructura metálica y obra civil - Área: 9,633 metros cuadrados',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-tequendama-parking-cali-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-tequendama-parking-cali-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-tequendama-parking-cali-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-tequendama-parking-cali-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-tequendama-parking-cali-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-tequendama-parking-cali-6-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-tequendama-parking-cali-7-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-tequendama-parking-cali-8-400x400.webp'
      ]
    },
    'edificio-modulos-medicos': {
      title: 'Módulos Médicos',
      location: 'No especificada',
      client: 'No especificado',
      weight: 'No especificado',
      description: 'Estructuras modulares médicas',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-modulos-medicos-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-modulos-medicos-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-modulos-medicos-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-modulos-medicos-4-400x400.webp'
      ]
    },

    // INDUSTRIA ADICIONAL
    'industria-torre-cogeneracion-propal': {
      title: 'Torre Cogeneración Propal',
      location: 'Yumbo, Valle del Cauca',
      client: 'Propal',
      weight: '110 toneladas',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-torre-cogeneracion-propal-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-torre-cogeneracion-propal-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-torre-cogeneracion-propal-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-torre-cogeneracion-propal-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-torre-cogeneracion-propal-5-400x400.webp'
      ]
    },
    'industria-bodega-duplex': {
      title: 'Bodega Duplex Ingeniería',
      location: 'No especificada',
      client: 'No especificado',
      weight: 'No especificado',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-duplex-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-duplex-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-duplex-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-duplex-4-400x400.webp'
      ]
    },
    'industria-bodega-intera': {
      title: 'Bodega Intera',
      location: 'Santander, Cauca',
      client: 'Intera SAS',
      weight: '79 toneladas',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-intera-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-intera-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-intera-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-intera-4-400x400.webp'
      ]
    },
    'industria-tecnofar': {
      title: 'Tecnofar',
      location: 'Villa Rica, Cauca',
      client: 'Constructora Inverteq S.A.S',
      weight: '612 toneladas',
      description: 'Estructura metálica - Área: 5,141 metros cuadrados',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-tecnofar-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-tecnofar-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-tecnofar-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-tecnofar-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-tecnofar-5-400x400.webp'
      ]
    },
    'industria-bodega-protecnica-etapa-dos': {
      title: 'Bodega Protecnica Etapa II',
      location: 'Yumbo, Valle',
      client: 'Protecnica Ingenieria SAS',
      weight: '28 toneladas',
      description: 'Estructura metálica, fachada y cubierta',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-protecnica-etapa-dos-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-protecnica-etapa-dos-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-protecnica-etapa-dos-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-protecnica-etapa-dos-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-protecnica-etapa-dos-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-protecnica-etapa-dos-6-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-bodega-protecnica-etapa-dos-7-400x400.webp'
      ]
    },
    'industria-tecnoquimicas-jamundi': {
      title: 'Tecnoquímicas Jamundí',
      location: 'Jamundí, Valle del Cauca',
      client: 'Tecnoquímicas S.A.',
      weight: '508 toneladas',
      description: 'Estructura metálica - Área: 3,676 metros cuadrados',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-tecnoquimicas-jamundi-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-tecnoquimicas-jamundi-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-tecnoquimicas-jamundi-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-tecnoquimicas-jamundi-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-tecnoquimicas-jamundi-5-400x400.webp'
      ]
    },

    // PUENTES VEHICULARES ADICIONALES
    'puente-vehicular-carrera-cien': {
      title: 'Puente Carrera 100',
      location: 'Cali, Valle del Cauca',
      client: 'Consorcio Islas 2019',
      weight: '420 toneladas',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-carrera-cien-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-carrera-cien-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-carrera-cien-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-carrera-cien-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-carrera-cien-5-400x400.webp'
      ]
    },
    'puente-vehicular-cambrin': {
      title: 'Puente Cambrin',
      location: 'Tolima',
      client: 'Consorcio Cambrin 2017',
      weight: '250 toneladas',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-cambrin-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-cambrin-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-cambrin-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-cambrin-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-cambrin-5-400x400.webp'
      ]
    },
    'puente-vehicular-frisoles': {
      title: 'Puente Frisoles',
      location: 'Pasto',
      client: 'No especificado',
      weight: 'No especificado',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-frisoles-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-frisoles-2-400x400.webp'
      ]
    },
    'puente-vehicular-la-veinti-uno': {
      title: 'Puente La 21',
      location: 'Cali, Valle del Cauca',
      client: 'Unión Temporal Espacio 2015',
      weight: '151 toneladas',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-la-veinti-uno-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-la-veinti-uno-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-la-veinti-uno-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-la-veinti-uno-4-400x400.webp'
      ]
    },
    'puente-vehicular-la-paila': {
      title: 'Puente La Paila',
      location: 'Vía Santander de Quilichao – Río Desbaratado, Cauca',
      client: 'Unión Temporal E&R',
      weight: '293 toneladas',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-la-paila-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-la-paila-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-la-paila-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-la-paila-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-la-paila-5-400x400.webp'
      ]
    },
    'puente-vehicular-saraconcho': {
      title: 'Puente Saraconcho',
      location: 'Bolívar, Cauca',
      client: 'No especificado',
      weight: 'No especificado',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-saraconcho-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-saraconcho-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-saraconcho-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-saraconcho-4-400x400.webp'
      ]
    },

    // PUENTES PEATONALES ADICIONALES
    'puente-peatonal-autopista-sur-cali': {
      title: 'Puente Autopista Sur - Carrera 68',
      location: 'Cali, Valle del Cauca',
      client: 'CONSORCIO VÍAS DE CALI S.A.S.',
      weight: '128 toneladas',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-autopista-sur-cali-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-autopista-sur-cali-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-autopista-sur-cali-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-autopista-sur-cali-4-400x400.webp'
      ]
    },
    'puente-peatonal-la-63-cali': {
      title: 'Puente de la 63',
      location: 'Cali, Valle del Cauca',
      client: 'No especificado',
      weight: 'No especificado',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-la-63-cali-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-la-63-cali-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-la-63-cali-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-la-63-cali-4-400x400.webp'
      ]
    },
    'puente-peatonal-la-tertulia': {
      title: 'La Tertulia',
      location: 'Cali, Valle del Cauca',
      client: 'Harold Méndez',
      weight: '8 toneladas',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-la-tertulia-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-la-tertulia-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-la-tertulia-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-la-tertulia-4-400x400.webp'
      ]
    },
    'puente-peatonal-terminal-intermedio': {
      title: 'Terminal Intermedio',
      location: 'Cali, Valle del Cauca',
      client: 'Consorcio Metrovial SB',
      weight: '240 toneladas',
      description: 'Estructura metálica',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-terminal-intermedio-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-terminal-intermedio-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-terminal-intermedio-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-terminal-intermedio-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-terminal-intermedio-5-400x400.webp'
      ]
    },

    // ESCENARIOS DEPORTIVOS ADICIONALES
    'escenario-deportivo-juegos-nacionales-coliseo-mayor': {
      title: 'Coliseo Mayor Juegos Nacionales 2012',
      location: 'Popayán, Cauca',
      client: 'MAJA S.A.S.',
      weight: 'No especificado',
      description: 'Obra civil y estructura metálica - Año: 2012',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-juegos-nacionales-coliseo-mayor-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-juegos-nacionales-coliseo-mayor-2-400x400.webp'
      ]
    },
    'escenario-deportivo-coliseo-de-artes-marciales': {
      title: 'Coliseo de Artes Marciales Nacionales 2012',
      location: 'Popayán, Cauca',
      client: 'MAJA S.A.S.',
      weight: 'No especificado',
      description: 'Obra civil y estructura metálica - Año: 2012',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-coliseo-de-artes-marciales-1-400x400.webp'
      ]
    },
    'escenario-deportivo-cecun': {
      title: 'Cecun (Universidad del Cauca)',
      location: 'Popayán, Cauca',
      client: 'Consorcio Cecun',
      weight: '78 toneladas',
      description: 'Estructura metálica y cubierta edificio Cecun',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cecun-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cecun-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cecun-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cecun-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cecun-5-400x400.webp'
      ]
    },
    'escenario-deportivo-cancha-javeriana-cali': {
      title: 'Cancha Javeriana Cali',
      location: 'Cali, Valle del Cauca',
      client: 'Pontificia Universidad Javeriana',
      weight: '117 toneladas',
      description: 'Estructura metálica, cerramientos y cubierta',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cancha-javeriana-cali-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cancha-javeriana-cali-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cancha-javeriana-cali-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cancha-javeriana-cali-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cancha-javeriana-cali-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cancha-javeriana-cali-6-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cancha-javeriana-cali-7-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-cancha-javeriana-cali-8-400x400.webp'
      ]
    }
  }

  const outputPath = path.join(process.cwd(), 'all-slider-images-downloaded')
  
  // Crear directorio de salida
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  let totalDownloaded = 0
  let totalImages = 0
  let markdownReport = '# 🖼️ TODAS LAS IMÁGENES ADICIONALES DE SLIDERS Y GALERÍAS\n\n'
  markdownReport += `**Fecha de extracción:** ${new Date().toLocaleString('es-CO')}\n\n`
  markdownReport += `**Fuente:** Sliders y galerías profundas del sitio web oficial meisa.com.co\n\n`

  for (const [projectKey, projectInfo] of Object.entries(allProjectsData)) {
    console.log(`\n📁 Procesando: ${projectInfo.title}`)
    
    const projectPath = path.join(outputPath, projectKey)
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true })
    }

    // Agregar información al reporte
    markdownReport += `## ${projectInfo.title.toUpperCase()}\n\n`
    markdownReport += `- **Ubicación:** ${projectInfo.location}\n`
    markdownReport += `- **Cliente:** ${projectInfo.client}\n`
    markdownReport += `- **Peso/Capacidad:** ${projectInfo.weight}\n`
    markdownReport += `- **Descripción:** ${projectInfo.description}\n`
    markdownReport += `- **Imágenes encontradas:** ${projectInfo.images.length}\n\n`

    let projectImageCount = 0
    totalImages += projectInfo.images.length

    for (let i = 0; i < projectInfo.images.length; i++) {
      const imageUrl = projectInfo.images[i]
      try {
        const fileName = generateFileName(imageUrl, projectKey, i)
        const filePath = path.join(projectPath, fileName)
        
        const downloadResult = await downloadImage(imageUrl, filePath)
        
        if (downloadResult.success) {
          console.log(`   ✅ ${fileName} (${downloadResult.size}KB)`)
          
          // Agregar al reporte markdown
          markdownReport += `### Imagen ${i + 1}\n`
          markdownReport += `- **Archivo local:** \`${fileName}\`\n`
          markdownReport += `- **URL original:** ${imageUrl}\n`
          markdownReport += `- **Tamaño:** ${downloadResult.size}KB\n`
          markdownReport += `- **Formato:** ${path.extname(fileName).toUpperCase().replace('.', '')}\n\n`

          projectImageCount++
          totalDownloaded++
        } else {
          console.log(`   ❌ Error descargando: ${fileName} - ${downloadResult.error}`)
        }
      } catch (error) {
        console.log(`   ❌ Error procesando imagen ${i + 1}: ${error}`)
      }
    }

    console.log(`   📊 Proyecto ${projectInfo.title}: ${projectImageCount}/${projectInfo.images.length} descargadas`)
    markdownReport += `**Descargadas exitosamente:** ${projectImageCount}/${projectInfo.images.length}\n\n`
    markdownReport += `---\n\n`
  }

  // Resumen final
  markdownReport += `# 📊 RESUMEN DE EXTRACCIÓN ADICIONAL\n\n`
  markdownReport += `- **Total proyectos adicionales procesados:** ${Object.keys(allProjectsData).length}\n`
  markdownReport += `- **Total imágenes adicionales encontradas:** ${totalImages}\n`
  markdownReport += `- **Total imágenes adicionales descargadas:** ${totalDownloaded}\n`
  markdownReport += `- **Tasa de éxito:** ${((totalDownloaded / totalImages) * 100).toFixed(1)}%\n`
  markdownReport += `- **Ubicación de archivos:** \`${outputPath}\`\n\n`

  // Guardar reporte
  const reportPath = path.join(process.cwd(), 'INFORMACION-REAL-MEISA.md')
  const existingContent = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, 'utf8') : ''
  
  // Agregar nueva sección
  const updatedContent = existingContent + '\n\n' + markdownReport
  fs.writeFileSync(reportPath, updatedContent)

  console.log('\n🎉 DESCARGA ADICIONAL COMPLETA!')
  console.log(`   📁 Imágenes adicionales guardadas en: ${outputPath}`)
  console.log(`   📊 Proyectos adicionales procesados: ${Object.keys(allProjectsData).length}`)
  console.log(`   🖼️  Imágenes adicionales descargadas: ${totalDownloaded}/${totalImages}`)
  console.log(`   💯 Tasa de éxito: ${((totalDownloaded / totalImages) * 100).toFixed(1)}%`)
  console.log(`   📝 Reporte actualizado en: INFORMACION-REAL-MEISA.md`)
}

function generateFileName(url: string, projectKey: string, index: number): string {
  const urlParts = url.split('/')
  const originalName = urlParts[urlParts.length - 1]
  const extension = path.extname(originalName) || '.webp'
  const baseName = path.basename(originalName, extension)
  
  return `${projectKey}-${(index + 1).toString().padStart(2, '0')}-${baseName}${extension}`
}

async function downloadImage(url: string, filePath: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }

    const buffer = await response.arrayBuffer()
    fs.writeFileSync(filePath, Buffer.from(buffer))
    
    const stats = fs.statSync(filePath)
    const sizeKB = Math.round(stats.size / 1024)
    
    return { success: true, size: sizeKB }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

downloadAllSliderImages().catch(console.error)