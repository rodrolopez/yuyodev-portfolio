import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white p-6">
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative z-10 max-w-4xl text-center space-y-8">
        {/* Etiqueta de disponibilidad */}
        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
          Disponible para nuevos proyectos
        </div>

        {/* Encabezado Principal */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-slate-200 to-slate-500">
          Arquitectura SaaS y <br />
          <span className="text-blue-500">Desarrollo a Medida</span>
        </h1>
        
        {/* Subtítulo enfocado en tu stack */}
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Diseñamos y construimos sistemas robustos, automatizaciones RPA y plataformas multi-tenant. Potenciamos tu negocio con tecnología escalable.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/contacto" 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            Iniciar un Proyecto
          </Link>
          <Link 
            href="/stack" 
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 rounded-lg font-semibold transition-all border border-slate-800 text-slate-300"
          >
            Conocer el Stack Técnico
          </Link>
        </div>
      </div>
    </main>
  );
}