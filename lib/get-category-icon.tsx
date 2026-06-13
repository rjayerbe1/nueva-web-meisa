import Image from "next/image"
import { parseIconValue } from "@/lib/category-assets"
import {
  Building, Factory, Camera, Layers,
  Home, Zap, Globe, Wrench, MoreHorizontal
} from "lucide-react"

const AVAILABLE_ICONS = {
  Building,
  Factory, 
  Camera,
  Layers,
  Home,
  Zap,
  Globe,
  Wrench,
  MoreHorizontal
}

export const getCategoryIconComponent = (iconName: string | null, size: string = "h-8 w-8") => {
  const iconData = parseIconValue(iconName)
  
  // Nuevo formato: SVG organizado
  if (iconData?.type === 'svg' && iconData.data?.path) {
    return (
      <Image
        src={iconData.data.path}
        alt="Category icon"
        width={256}
        height={256}
        className={`${size} object-contain`}
        style={{ filter: 'brightness(0) invert(1)' }}
      />
    )
  }

  // Formato legacy: imagen PNG
  if (iconData?.type === 'image' && iconData.data?.path) {
    return (
      <Image
        src={iconData.data.path}
        alt="Category icon"
        width={256}
        height={256}
        className={`${size} object-contain`}
      />
    )
  }
  
  // Formato Lucide
  if (iconData?.type === 'lucide' && iconData.key in AVAILABLE_ICONS) {
    const IconComponent = AVAILABLE_ICONS[iconData.key as keyof typeof AVAILABLE_ICONS]
    return <IconComponent className={size} />
  }
  
  return <Layers className={size} />
}