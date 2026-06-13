import Link from 'next/link';

export default function ServiciosPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-36 md:pt-40 pb-12 px-6">
      <div className="max-w-5xl w-full relative z-10">
        
        {/* Encabezado */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">Soluciones Empresariales</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Transformo lógicas de negocio complejas en sistemas de software escalables, seguros y de alto rendimiento.
          </p>
        </div>

        {/* Grilla de Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Servicio 1 */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">Arquitecturas SaaS Multi-tenant</h2>
            <p className="text-zinc-400 leading-relaxed">
              Desarrollo de plataformas centralizadas preparadas para servir a múltiples clientes o sucursales de forma simultánea, con bases de datos aisladas y alta seguridad.
            </p>
          </div>

          {/* Servicio 2 */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">Sistemas de Control y Auditoría</h2>
            <p className="text-zinc-400 leading-relaxed">
              Creación de software de misión crítica para la gestión en terreno, digitalización de órdenes de trabajo y trazabilidad de datos operativos en tiempo real.
            </p>
          </div>

          {/* Servicio 3 */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">Automatización RPA y Bots</h2>
            <p className="text-zinc-400 leading-relaxed">
              Optimización de flujos de trabajo mediante scripts y bots (ej. WhatsApp corporativo) que interactúan con sistemas legacy para reducir tareas manuales.
            </p>
          </div>

          {/* Servicio 4 */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">APIs y Backend a Medida</h2>
            <p className="text-zinc-400 leading-relaxed">
              Diseño de motores de datos robustos con .NET y PostgreSQL. Construyo la capa de infraestructura sólida que tus aplicaciones web o móviles necesitan para escalar.
            </p>
          </div>

        </div>

        {/* CTA final */}
        <div className="mt-16 text-center">
          <Link 
            href="/contacto" 
            className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded-lg font-bold transition-all shadow-lg shadow-emerald-500/20 hover:scale-105"
          >
            Discutir la arquitectura de tu proyecto
          </Link>
        </div>

      </div>
    </main>
  );
}