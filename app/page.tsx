import { ProjectsSection } from "@/components/home/ProjectsSection"
import { ServicesSection } from "@/components/home/ServicesSection"
import { StatsSection } from "@/components/home/StatsSection"
import { AboutSection } from "@/components/home/AboutSection"
import { ContactSection } from "@/components/home/ContactSection"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section Simple */}
      <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <h1 className="text-7xl md:text-8xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                  MEISA
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-gray-300 font-light tracking-wide">
                Metálicas e Ingeniería S.A.
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Construyendo el futuro con estructuras metálicas de vanguardia. 
              Innovación, calidad y excelencia en cada proyecto.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
                Nuestros Proyectos
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-600 hover:text-white transition-colors">
                Ver Video
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-8 text-center text-white">
            <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-lg">
              <div className="text-3xl font-bold text-orange-400">200+</div>
              <div className="text-sm text-gray-300">Proyectos</div>
            </div>
            <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-lg">
              <div className="text-3xl font-bold text-blue-400">15+</div>
              <div className="text-sm text-gray-300">Años</div>
            </div>
            <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-lg">
              <div className="text-3xl font-bold text-green-400">50+</div>
              <div className="text-sm text-gray-300">Clientes</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Secciones sin animaciones */}
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  )
}