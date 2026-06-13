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
          
          {/* SERVICIO GANCHO: Sitios Web Corporativos (Ocupa 2 columnas en pantallas medianas/grandes) */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group md:col-span-2">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">Sitios y Páginas Web Corporativas</h2>
            <h3 className="text-emerald-400 font-semibold mb-2">¿Tu empresa necesita una presencia digital imponente, rápida y optimizada?</h3>
            <p className="text-zinc-400 leading-relaxed">
              Diseño y desarrollo sitios web institucionales y landings de alto impacto utilizando tecnologías modernas. No utilizo plantillas genéricas ni constructores lentos; construyo experiencias web personalizadas, con una velocidad de carga óptima, SEO técnico estructurado desde el primer día y preparadas para escalar e integrarse con sistemas complejos en el futuro.
            </p>
          </div>

          {/* Servicio 2 */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">Arquitecturas SaaS Multi-tenant</h2>
            <h3 className="text-emerald-400 font-semibold mb-2">¿Tu negocio está listo para ser escalado y vendido a múltiples clientes?</h3>
            <p className="text-zinc-400 leading-relaxed">
              Desarrollo plataformas centralizadas que sirven a cientos de empresas de forma simultánea. Garantizo el máximo rendimiento mediante bases de datos aisladas y esquemas de alta seguridad.
            </p>
          </div>

          {/* Servicio 3 */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">Sistemas de Control y Auditoría</h2>
            <h3 className="text-emerald-400 font-semibold mb-2">¿Tu empresa necesita gestionar y auditar procesos críticos?</h3>
            <p className="text-zinc-400 leading-relaxed">
              Transformo procesos operativos tradicionales en flujos de trabajo digitales. A través de software a medida, brindo a las empresas trazabilidad de datos en tiempo real, control de calidad y auditoría.
            </p>
          </div>

          {/* Servicio 4 */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">Sistemas CRM y Gestión de Turnos</h2>
            <h3 className="text-emerald-400 font-semibold mb-2">¿Perdés clientes u oportunidades por una mala organización de agendas?</h3>
            <p className="text-zinc-400 leading-relaxed">
              Desarrollo sistemas integrales para la gestión de turnos con cupos dinámicos y flujos de reserva completos. Implemento perfiles de usuario y portales con túneles seguros para el intercambio de documentación sensible.
            </p>
          </div>

          {/* Servicio 5 */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">Portales CMS y Dashboards con IA</h2>
            <h3 className="text-emerald-400 font-semibold mb-2">¿Dependés de un tercero para cada cambio en tu web o analizar métricas?</h3>
            <p className="text-zinc-400 leading-relaxed">
              Creo gestores de contenido (CMS) a medida para que administres tu plataforma con total autonomía. Diseño Dashboards interactivos y reportes analíticos potenciados por Inteligencia Artificial para respaldar tu toma de decisiones.
            </p>
          </div>

          {/* Servicio 6 */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">Automatización RPA y Bots</h2>
            <h3 className="text-emerald-400 font-semibold mb-2">¿Tu equipo pierde tiempo valioso en tareas manuales y repetitivas?</h3>
            <p className="text-zinc-400 leading-relaxed">
              Analizo y optimizo tus flujos de trabajo de extremo a extremo. Mediante el desarrollo de scripts y bots, logro conectar sistemas legacy, acelerar tus operaciones y reducir drásticamente los errores humanos.
            </p>
          </div>

          {/* Servicio 7 */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">APIs y Backend a Medida</h2>
            <h3 className="text-emerald-400 font-semibold mb-2">¿Tu frontend es brillante pero el motor de datos no da abasto?</h3>
            <p className="text-zinc-400 leading-relaxed">
              Yo construyo la infraestructura profunda que tus aplicaciones necesitan para escalar. Diseño APIs de alto rendimiento con .NET y PostgreSQL, garantizando una capa lógica sólida y lista para soportar miles de peticiones concurrentes.
            </p>
          </div>

        </div>

        {/* CTA final */}
        <div className="mt-16 text-center">
          <Link 
            href="/contacto" 
            className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded-lg font-bold transition-all shadow-lg shadow-emerald-500/20 hover:scale-105"
          >
            ¡Hablemos de tu proyecto!
          </Link>
        </div>

      </div>
    </main>
  );
}