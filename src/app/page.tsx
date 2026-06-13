import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-36 md:pt-40 pb-12 px-6">
      
      {/* Fondo sutil con destellos */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl text-center space-y-8 mb-24">
        {/* Etiqueta de disponibilidad orgánica */}
        <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Disponible para nuevos proyectos
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-zinc-100 to-zinc-500">
          Arquitectura SaaS y <br />
          <span className="text-emerald-500">Soluciones Empresariales</span>
        </h1>
        
        {/* Subtítulo enfocado en tu stack */}
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Diseñamos sistemas robustos, automatizaciones y plataformas multi-tenant. Tecnología backend preparada para crecer y escalar en cualquier entorno.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link 
            href="/contacto" 
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded-lg font-bold transition-all shadow-lg shadow-emerald-500/20 hover:scale-105"
          >
            Iniciar un Proyecto
          </Link>
          <Link 
            href="/stack" 
            className="px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 rounded-lg font-semibold transition-all border border-zinc-800 hover:border-emerald-500/50 text-zinc-300"
          >
            Conocer el Stack Técnico
          </Link>
        </div>
      </div>

      {/* Sección Sobre Mí */}
      <section className="relative z-10 w-full max-w-4xl mt-12 text-left bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">Raíces fuertes, sistemas escalables.</h2>
        </div>
        
        <div className="space-y-4 text-zinc-400 leading-relaxed text-lg">
          <p>
            Toda mi vida trabajé la tierra como jardinero. En la naturaleza aprendí una lección fundamental: para que un ecosistema prospere, necesita bases sólidas y la capacidad de adaptarse a su entorno. El <strong>yuyo</strong>, a menudo subestimado, es la prueba definitiva de resiliencia: crece rápido, rompe barreras y prospera donde sale.
          </p>
          <p>
            Hoy, aplico esa misma filosofía al desarrollo de software corporativo. Como desarrollador especializado en el ecosistema <strong>.NET (C#, ASP.NET Core)</strong> y <strong>PostgreSQL</strong>, construyo el &quot;sistema de raíces&quot; de los negocios digitales. 
          </p>
          <p>
            Desde diversos sistemas simples hasta plataformas SaaS con arquitecturas complejas, mi enfoque es crear código que comparta la esencia de la naturaleza: estructurado, vivo y hecho para resistir la prueba del tiempo.
          </p>
        </div>
      </section>
      
    </main>
  );
}