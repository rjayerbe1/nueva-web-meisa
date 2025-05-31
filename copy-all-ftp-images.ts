import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// FTP backup base path
const FTP_BASE = '/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/wordpress-ftp-backup-20250528-085630/wp-content/uploads'

// Destination directory
const DEST_DIR = './public/uploads/projects'

// Comprehensive mapping of FTP images to database expected names
const ftpImageMapping = {
  // CENTROS COMERCIALES
  'Centro-campanario-1.webp': '2023/05/Centro-campanario-1-600x403.webp',
  'Centro-campanario-2.webp': '2023/05/Centro-campanario-2-600x403.webp',
  'Centro-campanario-3.webp': '2023/05/Centro-campanario-3-600x403.webp',
  'Centro-campanario-4.webp': '2023/05/Centro-campanario-4-600x403.webp',
  'Centro-campanario-5.webp': '2023/05/Centro-campanario-5-600x403.webp',
  'Centro-campanario-6.webp': '2023/05/Centro-campanario-6-600x403.webp',
  'Centro-campanario-7.webp': '2023/05/Centro-campanario-7-600x403.webp',

  'Centro-monserrat-1.webp': '2023/05/Centro-monserrat-1-600x403.webp',
  'Centro-monserrat-2.webp': '2023/05/Centro-monserrat-2-600x403.webp',
  'Centro-monserrat-3.webp': '2023/05/Centro-monserrat-3-600x403.webp',
  'Centro-monserrat-4.webp': '2023/05/Centro-monserrat-4-600x403.webp',
  'Centro-monserrat-5.webp': '2023/05/Centro-monserrat-5-600x403.webp',

  'Centro-unico-cali-1.webp': '2021/03/Centro-unico-cali-1-600x403.webp',
  'Centro-unico-cali-2.webp': '2021/03/Centro-unico-cali-2-600x403.webp',
  'Centro-unico-cali-3.webp': '2021/03/Centro-unico-cali-3-600x403.webp',
  'Centro-unico-cali-4.webp': '2021/03/Centro-unico-cali-4-600x403.webp',
  'Centro-unico-cali-5.webp': '2021/03/Centro-unico-cali-5-600x403.webp',

  'Centro-unico-neiva-1.webp': '2021/03/Centro-unico-neiva-1-600x403.webp',
  'Centro-unico-neiva-2.webp': '2021/03/Centro-unico-neiva-2-600x403.webp',
  'Centro-unico-neiva-3.webp': '2021/03/Centro-unico-neiva-3-600x403.webp',
  'Centro-unico-neiva-4.webp': '2021/03/Centro-unico-neiva-4-600x403.webp',
  'Centro-unico-neiva-5.webp': '2021/03/Centro-unico-neiva-5-600x403.webp',

  'Centro-unico-barranquilla-2.webp': '2021/03/Centro-unico-barranquilla-2-600x403.webp',
  'Centro-unico-barranquilla-3.webp': '2021/03/Centro-unico-barranquilla-3-600x403.webp',

  'Centro-armenia-plaza-1.webp': '2021/03/Centro-armenia-plaza-1-600x403.webp',
  'Centro-armenia-plaza-2.webp': '2021/03/Centro-armenia-plaza-2-600x403.webp',
  'Centro-armenia-plaza-3.webp': '2021/03/Centro-armenia-plaza-3-600x403.webp',
  'Centro-armenia-plaza-4.webp': '2021/03/Centro-armenia-plaza-4-600x403.webp',

  'Centro-bochalema-plaza-1.webp': '2021/03/Centro-bochalema-plaza-1-600x403.webp',
  'Centro-bochalema-plaza-2.webp': '2021/03/Centro-bochalema-plaza-2-600x403.webp',
  'Centro-bochalema-plaza-3.webp': '2021/03/Centro-bochalema-plaza-3-600x403.webp',
  'Centro-bochalema-plaza-4.webp': '2021/03/Centro-bochalema-plaza-4-600x403.webp',
  'Centro-bochalema-plaza-5.webp': '2021/03/Centro-bochalema-plaza-5-600x403.webp',
  'Centro-bochalema-plaza-6.webp': '2021/03/Centro-bochalema-plaza-6-600x403.webp',
  'Centro-bochalema-plaza-7.webp': '2021/03/Centro-bochalema-plaza-7-600x403.webp',
  'Centro-bochalema-plaza-8.webp': '2021/03/Centro-bochalema-plaza-8-600x403.webp',
  'Centro-bochalema-plaza-9.webp': '2021/03/Centro-bochalema-plaza-9-600x403.webp',

  // EDIFICIOS
  'Edificio-cinemateca-distrital-1.webp': '2023/05/Edificio-cinemateca-distrital-1-600x403.webp',
  'Edificio-cinemateca-distrital-2.webp': '2023/05/Edificio-cinemateca-distrital-2-600x403.webp',
  'Edificio-cinemateca-distrital-3.webp': '2023/05/Edificio-cinemateca-distrital-3-600x403.webp',
  'Edificio-cinemateca-distrital-4.webp': '2023/05/Edificio-cinemateca-distrital-4-600x403.webp',
  'Edificio-cinemateca-distrital-5.webp': '2023/05/Edificio-cinemateca-distrital-5-600x403.webp',
  'Edificio-cinemateca-distrital-6.webp': '2023/05/Edificio-cinemateca-distrital-6-600x403.webp',

  'Edificio-clinica-reina-victoria-1.webp': '2023/05/Edificio-clinica-reina-victoria-1-600x403.webp',
  'Edificio-clinica-reina-victoria-2.webp': '2023/05/Edificio-clinica-reina-victoria-2-600x403.webp',
  'Edificio-clinica-reina-victoria-3.webp': '2023/05/Edificio-clinica-reina-victoria-3-600x403.webp',
  'Edificio-clinica-reina-victoria-4.webp': '2023/05/Edificio-clinica-reina-victoria-4-600x403.webp',
  'Edificio-clinica-reina-victoria-5.webp': '2023/05/Edificio-clinica-reina-victoria-5-600x403.webp',
  'Edificio-clinica-reina-victoria-6.webp': '2023/05/Edificio-clinica-reina-victoria-6-600x403.webp',
  'Edificio-clinica-reina-victoria-7.webp': '2023/05/Edificio-clinica-reina-victoria-7-600x403.webp',

  'Edificio-omega-1.webp': '2021/03/Edificio-omega-1-600x403.webp',
  'Edificio-omega-2.webp': '2021/03/Edificio-omega-2-600x403.webp',
  'Edificio-omega-3.webp': '2021/03/Edificio-omega-3-600x403.webp',
  'Edificio-omega-4.webp': '2021/03/Edificio-omega-4-600x403.webp',

  'Edificio-bomberos-popayan-1.webp': '2021/03/Edificio-bomberos-popayan-1-600x403.webp',
  'Edificio-bomberos-popayan-2.webp': '2021/03/Edificio-bomberos-popayan-2-600x403.webp',
  'Edificio-bomberos-popayan-3.webp': '2021/03/Edificio-bomberos-popayan-3-600x403.webp',
  'Edificio-bomberos-popayan-4.webp': '2021/03/Edificio-bomberos-popayan-4-600x403.webp',
  'Edificio-bomberos-popayan-5.webp': '2021/03/Edificio-bomberos-popayan-5-600x403.webp',

  'Edificio-estacion-mio-guadalupe-1.webp': '2021/03/Edificio-estacion-mio-guadalupe-1-600x403.webp',
  'Edificio-estacion-mio-guadalupe-2.webp': '2021/03/Edificio-estacion-mio-guadalupe-2-600x403.webp',
  'Edificio-estacion-mio-guadalupe-3.webp': '2021/03/Edificio-estacion-mio-guadalupe-3-600x403.webp',
  'Edificio-estacion-mio-guadalupe-4.webp': '2021/03/Edificio-estacion-mio-guadalupe-4-600x403.webp',
  'Edificio-estacion-mio-guadalupe-5.webp': '2021/03/Edificio-estacion-mio-guadalupe-5-600x403.webp',
  'Edificio-estacion-mio-guadalupe-6.webp': '2021/03/Edificio-estacion-mio-guadalupe-6-600x403.webp',

  'Edificio-sena-santander-1.webp': '2021/03/Edificio-sena-santander-1-600x403.webp',
  'Edificio-sena-santander-2.webp': '2021/03/Edificio-sena-santander-2-600x403.webp',
  'Edificio-sena-santander-3.webp': '2021/03/Edificio-sena-santander-3-600x403.webp',
  'Edificio-sena-santander-4.webp': '2021/03/Edificio-sena-santander-4-600x403.webp',

  'Edificio-terminal-intermedio-mio-cali-1.webp': '2021/03/Edificio-terminal-intermedio-mio-cali-1-600x403.webp',
  'Edificio-terminal-intermedio-mio-cali-2.webp': '2021/03/Edificio-terminal-intermedio-mio-cali-2-600x403.webp',
  'Edificio-terminal-intermedio-mio-cali-3.webp': '2021/03/Edificio-terminal-intermedio-mio-cali-3-600x403.webp',
  'Edificio-terminal-intermedio-mio-cali-4.webp': '2021/03/Edificio-terminal-intermedio-mio-cali-4-600x403.webp',
  'Edificio-terminal-intermedio-mio-cali-5.webp': '2021/03/Edificio-terminal-intermedio-mio-cali-5-600x403.webp',
  'Edificio-terminal-intermedio-mio-cali-6.webp': '2021/03/Edificio-terminal-intermedio-mio-cali-6-600x403.webp',
  'Edificio-terminal-intermedio-mio-cali-7.webp': '2021/03/Edificio-terminal-intermedio-mio-cali-7-600x403.webp',
  'Edificio-terminal-intermedio-mio-cali-8.webp': '2021/03/Edificio-terminal-intermedio-mio-cali-8-600x403.webp',

  'Edificio-tequendama-parking-cali-1.webp': '2021/03/Edificio-tequendama-parking-cali-1-600x403.webp',
  'Edificio-tequendama-parking-cali-2.webp': '2021/03/Edificio-tequendama-parking-cali-2-600x403.webp',
  'Edificio-tequendama-parking-cali-3.webp': '2021/03/Edificio-tequendama-parking-cali-3-600x403.webp',
  'Edificio-tequendama-parking-cali-4.webp': '2021/03/Edificio-tequendama-parking-cali-4-600x403.webp',
  'Edificio-tequendama-parking-cali-5.webp': '2021/03/Edificio-tequendama-parking-cali-5-600x403.webp',
  'Edificio-tequendama-parking-cali-6.webp': '2021/03/Edificio-tequendama-parking-cali-6-600x403.webp',
  'Edificio-tequendama-parking-cali-7.webp': '2021/03/Edificio-tequendama-parking-cali-7-600x403.webp',
  'Edificio-tequendama-parking-cali-8.webp': '2021/03/Edificio-tequendama-parking-cali-8-600x403.webp',

  'Edificio-modulos-medicos-1.webp': '2021/03/Edificio-modulos-medicos-1-600x403.webp',
  'Edificio-modulos-medicos-2.webp': '2021/03/Edificio-modulos-medicos-2-600x403.webp',
  'Edificio-modulos-medicos-3.webp': '2021/03/Edificio-modulos-medicos-3-600x403.webp',
  'Edificio-modulos-medicos-4.webp': '2021/03/Edificio-modulos-medicos-4-600x403.webp',

  // INDUSTRIA
  'Industria-ampliacion-cargill-1-400x400.webp': '2023/05/Industria-ampliacion-cargill-1-600x403.webp',
  'Industria-ampliacion-cargill-2-400x400.webp': '2023/05/Industria-ampliacion-cargill-2-600x403.webp',
  'Industria-ampliacion-cargill-3-400x400.webp': '2023/05/Industria-ampliacion-cargill-3-600x403.webp',
  'Industria-ampliacion-cargill-4-400x400.webp': '2023/05/Industria-ampliacion-cargill-4-600x403.webp',
  'Industria-ampliacion-cargill-5-400x400.webp': '2023/05/Industria-ampliacion-cargill-5-600x403.webp',
  'Industria-ampliacion-cargill-6-400x400.webp': '2023/05/Industria-ampliacion-cargill-6-600x403.webp',

  'Industria-torre-cogeneracion-propal-1.webp': '2021/03/Industria-torre-cogeneracion-propal-1-600x403.webp',
  'Industria-torre-cogeneracion-propal-2.webp': '2021/03/Industria-torre-cogeneracion-propal-2-600x403.webp',
  'Industria-torre-cogeneracion-propal-3.webp': '2021/03/Industria-torre-cogeneracion-propal-3-600x403.webp',
  'Industria-torre-cogeneracion-propal-4.webp': '2021/03/Industria-torre-cogeneracion-propal-4-600x403.webp',
  'Industria-torre-cogeneracion-propal-5.webp': '2021/03/Industria-torre-cogeneracion-propal-5-600x403.webp',

  'Industria-bodega-duplex-1.webp': '2021/03/Industria-bodega-duplex-1-600x403.webp',
  'Industria-bodega-duplex-2.webp': '2021/03/Industria-bodega-duplex-2-600x403.webp',
  'Industria-bodega-duplex-3.webp': '2021/03/Industria-bodega-duplex-3-600x403.webp',
  'Industria-bodega-duplex-4.webp': '2021/03/Industria-bodega-duplex-4-600x403.webp',

  'Industria-bodega-intera-1.webp': '2021/03/Industria-bodega-intera-1-600x403.webp',
  'Industria-bodega-intera-2.webp': '2021/03/Industria-bodega-intera-2-600x403.webp',
  'Industria-bodega-intera-3.webp': '2021/03/Industria-bodega-intera-3-600x403.webp',
  'Industria-bodega-intera-4.webp': '2021/03/Industria-bodega-intera-4-600x403.webp',

  'Industria-tecnofar-1.webp': '2021/03/Industria-tecnofar-1-600x403.webp',
  'Industria-tecnofar-2.webp': '2021/03/Industria-tecnofar-2-600x403.webp',
  'Industria-tecnofar-3.webp': '2021/03/Industria-tecnofar-3-600x403.webp',
  'Industria-tecnofar-4.webp': '2021/03/Industria-tecnofar-4-600x403.webp',
  'Industria-tecnofar-5.webp': '2021/03/Industria-tecnofar-5-600x403.webp',

  'Industria-bodega-protecnica-etapa-dos-1.webp': '2021/03/Industria-bodega-protecnica-etapa-dos-1-600x403.webp',
  'Industria-bodega-protecnica-etapa-dos-2.webp': '2021/03/Industria-bodega-protecnica-etapa-dos-2-600x403.webp',
  'Industria-bodega-protecnica-etapa-dos-3.webp': '2021/03/Industria-bodega-protecnica-etapa-dos-3-600x403.webp',
  'Industria-bodega-protecnica-etapa-dos-4.webp': '2021/03/Industria-bodega-protecnica-etapa-dos-4-600x403.webp',
  'Industria-bodega-protecnica-etapa-dos-5.webp': '2021/03/Industria-bodega-protecnica-etapa-dos-5-600x403.webp',
  'Industria-bodega-protecnica-etapa-dos-6.webp': '2021/03/Industria-bodega-protecnica-etapa-dos-6-600x403.webp',
  'Industria-bodega-protecnica-etapa-dos-7.webp': '2021/03/Industria-bodega-protecnica-etapa-dos-7-600x403.webp',

  'Industria-tecnoquimicas-jamundi-1.webp': '2021/03/Industria-tecnoquimicas-jamundi-1-600x403.webp',
  'Industria-tecnoquimicas-jamundi-2.webp': '2021/03/Industria-tecnoquimicas-jamundi-2-600x403.webp',
  'Industria-tecnoquimicas-jamundi-3.webp': '2021/03/Industria-tecnoquimicas-jamundi-3-600x403.webp',
  'Industria-tecnoquimicas-jamundi-4.webp': '2021/03/Industria-tecnoquimicas-jamundi-4-600x403.webp',
  'Industria-tecnoquimicas-jamundi-5.webp': '2021/03/Industria-tecnoquimicas-jamundi-5-600x403.webp',

  // PUENTES VEHICULARES
  'Puente-vehicular-nolasco-1.webp': '2021/03/Puente-vehicular-nolasco-1-600x403.webp',
  'Puente-vehicular-nolasco-2.webp': '2021/03/Puente-vehicular-nolasco-2-600x403.webp',
  'Puente-vehicular-nolasco-3.webp': '2021/03/Puente-vehicular-nolasco-3-600x403.webp',

  'Puente-vehicular-carrera-cien-1.webp': '2021/03/Puente-vehicular-carrera-cien-1-600x403.webp',
  'Puente-vehicular-carrera-cien-2.webp': '2021/03/Puente-vehicular-carrera-cien-2-600x403.webp',
  'Puente-vehicular-carrera-cien-3.webp': '2021/03/Puente-vehicular-carrera-cien-3-600x403.webp',
  'Puente-vehicular-carrera-cien-4.webp': '2021/03/Puente-vehicular-carrera-cien-4-600x403.webp',
  'Puente-vehicular-carrera-cien-5.webp': '2021/03/Puente-vehicular-carrera-cien-5-600x403.webp',

  'Puente-vehicular-cambrin-1.webp': '2021/03/Puente-vehicular-cambrin-1-600x403.webp',
  'Puente-vehicular-cambrin-2.webp': '2021/03/Puente-vehicular-cambrin-2-600x403.webp',
  'Puente-vehicular-cambrin-3.webp': '2021/03/Puente-vehicular-cambrin-3-600x403.webp',
  'Puente-vehicular-cambrin-4.webp': '2021/03/Puente-vehicular-cambrin-4-600x403.webp',
  'Puente-vehicular-cambrin-5.webp': '2021/03/Puente-vehicular-cambrin-5-600x403.webp',

  'Puente-vehicular-frisoles-1.webp': '2021/03/Puente-vehicular-frisoles-1-600x403.webp',
  'Puente-vehicular-frisoles-2.webp': '2021/03/Puente-vehicular-frisoles-2-600x403.webp',

  'Puente-vehicular-la-veinti-uno-1.webp': '2021/03/Puente-vehicular-la-veinti-uno-1-600x403.webp',
  'Puente-vehicular-la-veinti-uno-2.webp': '2021/03/Puente-vehicular-la-veinti-uno-2-600x403.webp',
  'Puente-vehicular-la-veinti-uno-3.webp': '2021/03/Puente-vehicular-la-veinti-uno-3-600x403.webp',
  'Puente-vehicular-la-veinti-uno-4.webp': '2021/03/Puente-vehicular-la-veinti-uno-4-600x403.webp',

  'Puente-vehicular-la-paila-1.webp': '2021/03/Puente-vehicular-la-paila-1-600x403.webp',
  'Puente-vehicular-la-paila-2.webp': '2021/03/Puente-vehicular-la-paila-2-600x403.webp',
  'Puente-vehicular-la-paila-3.webp': '2021/03/Puente-vehicular-la-paila-3-600x403.webp',
  'Puente-vehicular-la-paila-4.webp': '2021/03/Puente-vehicular-la-paila-4-600x403.webp',
  'Puente-vehicular-la-paila-5.webp': '2021/03/Puente-vehicular-la-paila-5-600x403.webp',

  'Puente-vehicular-saraconcho-1.webp': '2021/03/Puente-vehicular-saraconcho-1-600x403.webp',
  'Puente-vehicular-saraconcho-2.webp': '2021/03/Puente-vehicular-saraconcho-2-600x403.webp',
  'Puente-vehicular-saraconcho-3.webp': '2021/03/Puente-vehicular-saraconcho-3-600x403.webp',
  'Puente-vehicular-saraconcho-4.webp': '2021/03/Puente-vehicular-saraconcho-4-600x403.webp',

  // PUENTES PEATONALES
  'Puente peatonal escalinata curva rio cali 1.webp': '2021/03/Puente-peatonal-escalinata-curva-rio-cali-1-600x403.webp',
  'Puente peatonal escalinata curva rio cali 2.webp': '2021/03/Puente-peatonal-escalinata-curva-rio-cali-2-600x403.webp',
  'Puente peatonal escalinata curva rio cali 3.webp': '2021/03/Puente-peatonal-escalinata-curva-rio-cali-3-600x403.webp',
  'Puente peatonal escalinata curva rio cali 4.webp': '2021/03/Puente-peatonal-escalinata-curva-rio-cali-4-600x403.webp',
  'Puente peatonal escalinata curva rio cali 5.webp': '2021/03/Puente-peatonal-escalinata-curva-rio-cali-5-600x403.webp',
  'Puente peatonal escalinata curva rio cali 6.webp': '2021/03/Puente-peatonal-escalinata-curva-rio-cali-6-600x403.webp',

  'Puente peatonal autopista sur cali 1.webp': '2021/03/Puente-peatonal-autopista-sur-cali-1-600x403.webp',
  'Puente peatonal autopista sur cali 2.webp': '2021/03/Puente-peatonal-autopista-sur-cali-2-600x403.webp',
  'Puente peatonal autopista sur cali 3.webp': '2021/03/Puente-peatonal-autopista-sur-cali-3-600x403.webp',
  'Puente peatonal autopista sur cali 4.webp': '2021/03/Puente-peatonal-autopista-sur-cali-4-600x403.webp',

  'Puente peatonal la 63 cali 1.webp': '2021/03/Puente-peatonal-la-63-cali-1-600x403.webp',
  'Puente peatonal la 63 cali 2.webp': '2021/03/Puente-peatonal-la-63-cali-2-600x403.webp',
  'Puente peatonal la 63 cali 3.webp': '2021/03/Puente-peatonal-la-63-cali-3-600x403.webp',
  'Puente peatonal la 63 cali 4.webp': '2021/03/Puente-peatonal-la-63-cali-4-600x403.webp',

  'Puente peatonal la tertulia 1.webp': '2021/03/Puente-peatonal-la-tertulia-1-600x403.webp',
  'Puente peatonal la tertulia 2.webp': '2021/03/Puente-peatonal-la-tertulia-2-600x403.webp',
  'Puente peatonal la tertulia 3.webp': '2021/03/Puente-peatonal-la-tertulia-3-600x403.webp',
  'Puente peatonal la tertulia 4.webp': '2021/03/Puente-peatonal-la-tertulia-4-600x403.webp',

  'Puente peatonal terminal intermedio 1.webp': '2021/03/Puente-peatonal-terminal-intermedio-1-600x403.webp',
  'Puente peatonal terminal intermedio 2.webp': '2021/03/Puente-peatonal-terminal-intermedio-2-600x403.webp',
  'Puente peatonal terminal intermedio 3.webp': '2021/03/Puente-peatonal-terminal-intermedio-3-600x403.webp',
  'Puente peatonal terminal intermedio 4.webp': '2021/03/Puente-peatonal-terminal-intermedio-4-600x403.webp',
  'Puente peatonal terminal intermedio 5.webp': '2021/03/Puente-peatonal-terminal-intermedio-5-600x403.webp',

  // ESCENARIOS DEPORTIVOS
  'Escenario-deportivo-compejo-acuativo-popayan-1.webp': '2021/03/Escenario-deportivo-complejo-acuatico-popayan-1-600x403.webp',
  'Escenario-deportivo-complejo-acuatico-popayan-2.webp': '2021/03/Escenario-deportivo-complejo-acuatico-popayan-2-600x403.webp',

  'Escenario-deportivo-juegos-nacionales-coliseo-mayor-1.webp': '2021/03/Escenario-deportivo-juegos-nacionales-coliseo-mayor-1-600x403.webp',
  'Escenario-deportivo-juegos-nacionales-coliseo-mayor-2.webp': '2021/03/Escenario-deportivo-juegos-nacionales-coliseo-mayor-2-600x403.webp',

  'Escenario-deportivo-coliseo-de-artes-marciales-1.webp': '2021/03/Escenario-deportivo-coliseo-de-artes-marciales-1-600x403.webp',

  'Escenario-deportivo-cecun-1.webp': '2021/03/Escenario-deportivo-cecun-1-600x403.webp',
  'Escenario-deportivo-cecun-2.webp': '2021/03/Escenario-deportivo-cecun-2-600x403.webp',
  'Escenario-deportivo-cecun-3.webp': '2021/03/Escenario-deportivo-cecun-3-600x403.webp',
  'Escenario-deportivo-cecun-4.webp': '2021/03/Escenario-deportivo-cecun-4-600x403.webp',
  'Escenario-deportivo-cecun-5.webp': '2021/03/Escenario-deportivo-cecun-5-600x403.webp',

  'Escenario-deportivo-cancha-javeriana-cali-1.webp': '2021/03/Escenario-deportivo-cancha-javeriana-cali-1-600x403.webp',
  'Escenario-deportivo-cancha-javeriana-cali-2.webp': '2021/03/Escenario-deportivo-cancha-javeriana-cali-2-600x403.webp',
  'Escenario-deportivo-cancha-javeriana-cali-3.webp': '2021/03/Escenario-deportivo-cancha-javeriana-cali-3-600x403.webp',
  'Escenario-deportivo-cancha-javeriana-cali-4.webp': '2021/03/Escenario-deportivo-cancha-javeriana-cali-4-600x403.webp',
  'Escenario-deportivo-cancha-javeriana-cali-5.webp': '2021/03/Escenario-deportivo-cancha-javeriana-cali-5-600x403.webp',
  'Escenario-deportivo-cancha-javeriana-cali-6.webp': '2021/03/Escenario-deportivo-cancha-javeriana-cali-6-600x403.webp',
  'Escenario-deportivo-cancha-javeriana-cali-7.webp': '2021/03/Escenario-deportivo-cancha-javeriana-cali-7-600x403.webp',
  'Escenario-deportivo-cancha-javeriana-cali-8.webp': '2021/03/Escenario-deportivo-cancha-javeriana-cali-8-600x403.webp',

  // ESTRUCTURAS MODULARES
  'Estructura-modular-cocina-oculta-2-400x400.webp': '2021/03/Estructura-modular-cocina-oculta-2-600x403.webp',
  'Estructura-modular-cocina-oculta-3-400x400.webp': '2021/03/Estructura-modular-cocina-oculta-3-600x403.webp',

  'Estructura-modular-modulo-oficina-1-400x400.webp': '2021/03/Estructura-modular-modulo-oficina-1-600x403.webp',
  'Estructura-modular-modulo-oficina-2-400x400.webp': '2021/03/Estructura-modular-modulo-oficina-2-600x403.webp',
  'Estructura-modular-modulo-oficina-3-400x400.webp': '2021/03/Estructura-modular-modulo-oficina-3-600x403.webp',

  // OIL & GAS
  'Oil-gas-tanque-pulmon-1-400x400.webp': '2021/03/Oil-gas-tanque-pulmon-1-600x403.webp',

  'Oil-gas-tanque-de-almacenamiento-gpl-1-400x400.webp': '2021/03/Oil-gas-tanque-de-almacenamiento-gpl-1-600x403.webp',
  'Oil-gas-tanque-de-almacenamiento-gpl-2-400x400.webp': '2021/03/Oil-gas-tanque-de-almacenamiento-gpl-2-600x403.webp',
  'Oil-gas-tanque-de-almacenamiento-gpl-3-400x400.webp': '2021/03/Oil-gas-tanque-de-almacenamiento-gpl-3-600x403.webp',
  'Oil-gas-tanque-de-almacenamiento-gpl-4-400x400.webp': '2021/03/Oil-gas-tanque-de-almacenamiento-gpl-4-600x403.webp',
  'Oil-gas-tanque-de-almacenamiento-gpl-5-400x400.webp': '2021/03/Oil-gas-tanque-de-almacenamiento-gpl-5-600x403.webp',
  'Oil-gas-tanque-de-almacenamiento-gpl-6-400x400.webp': '2021/03/Oil-gas-tanque-de-almacenamiento-gpl-6-600x403.webp',

  // CUBIERTAS Y FACHADAS
  'Cubiertas-y-fachadas-camino-viejo-1.webp': '2021/03/Cubiertas-y-fachadas-camino-viejo-1-600x403.webp',
  'Cubiertas-y-fachadas-camino-viejo-2.webp': '2021/03/Cubiertas-y-fachadas-camino-viejo-2-600x403.webp',

  'Cubiertas-y-fachadas-cubierta-interna-1.webp': '2021/03/Cubiertas-y-fachadas-cubierta-interna-1-600x403.webp',
  'Cubiertas-y-fachadas-cubierta-interna-2.webp': '2021/03/Cubiertas-y-fachadas-cubierta-interna-2-600x403.webp',

  'Cubiertas-y-fachadas-ips-sura-1.webp': '2021/03/Cubiertas-y-fachadas-ips-sura-1-600x403.webp',
  'Cubiertas-y-fachadas-ips-sura-2.webp': '2021/03/Cubiertas-y-fachadas-ips-sura-2-600x403.webp',

  'Cubiertas-y-fachadas-taquillas-pisoje-1.webp': '2021/03/Cubiertas-y-fachadas-taquillas-pisoje-1-600x403.webp',
  'Cubiertas-y-fachadas-taquillas-pisoje-2.webp': '2021/03/Cubiertas-y-fachadas-taquillas-pisoje-2-600x403.webp',

  'Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-1.webp': '2021/03/Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-1-600x403.webp',
  'Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-2.webp': '2021/03/Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-2-600x403.webp'
}

async function copyAllFtpImages() {
  try {
    console.log('🚀 Iniciando copia completa de imágenes desde FTP backup...')
    
    // Crear directorio de destino si no existe
    if (!fs.existsSync(DEST_DIR)) {
      fs.mkdirSync(DEST_DIR, { recursive: true })
      console.log(`📁 Directorio creado: ${DEST_DIR}`)
    }
    
    let copiedCount = 0
    let failedCount = 0
    const failed: string[] = []
    
    console.log(`📊 Total de imágenes a copiar: ${Object.keys(ftpImageMapping).length}`)
    console.log('')
    
    for (const [expectedName, ftpPath] of Object.entries(ftpImageMapping)) {
      const sourcePath = path.join(FTP_BASE, ftpPath)
      const destPath = path.join(DEST_DIR, expectedName)
      
      try {
        // Verificar si el archivo fuente existe
        if (!fs.existsSync(sourcePath)) {
          console.log(`⚠️  Archivo no encontrado: ${ftpPath}`)
          failedCount++
          failed.push(expectedName)
          continue
        }
        
        // Verificar si ya existe en destino
        if (fs.existsSync(destPath)) {
          console.log(`⏭️  Ya existe: ${expectedName}`)
          copiedCount++
          continue
        }
        
        // Copiar archivo
        fs.copyFileSync(sourcePath, destPath)
        console.log(`✅ Copiado: ${expectedName}`)
        copiedCount++
        
      } catch (error) {
        console.error(`❌ Error copiando ${expectedName}:`, error)
        failedCount++
        failed.push(expectedName)
      }
    }
    
    console.log(`\n🎉 COPIA COMPLETADA!`)
    console.log(`📊 RESUMEN:`)
    console.log(`   ✅ Exitosas: ${copiedCount}`)
    console.log(`   ❌ Fallidas: ${failedCount}`)
    console.log(`   📈 Tasa de éxito: ${((copiedCount / Object.keys(ftpImageMapping).length) * 100).toFixed(1)}%`)
    
    if (failed.length > 0) {
      console.log(`\n❌ IMÁGENES FALLIDAS:`)
      failed.forEach(name => {
        console.log(`   • ${name}`)
      })
    }
    
    console.log(`\n📁 Imágenes disponibles en: ${DEST_DIR}`)
    console.log(`🔗 URL base para la web: /uploads/projects/`)
    
    // Verificar algunas imágenes clave
    const keyImages = [
      'Centro-campanario-1.webp',
      'Centro-monserrat-1.webp', 
      'Edificio-cinemateca-distrital-1.webp',
      'Puente-vehicular-nolasco-1.webp'
    ]
    
    console.log(`\n🔍 VERIFICACIÓN DE IMÁGENES CLAVE:`)
    keyImages.forEach(img => {
      const exists = fs.existsSync(path.join(DEST_DIR, img))
      console.log(`   ${exists ? '✅' : '❌'} ${img}`)
    })
    
    return { copiedCount, failedCount, failed }
    
  } catch (error) {
    console.error('❌ Error general en la copia:', error)
    throw error
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  copyAllFtpImages()
    .then(result => {
      console.log(`\n🎯 Proceso completado: ${result.copiedCount} exitosas, ${result.failedCount} fallidas`)
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Error fatal:', error)
      process.exit(1)
    })
}

export { copyAllFtpImages, ftpImageMapping }