import Link from 'next/link';

export default function StackPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-36 md:pt-40 pb-12 px-6">
      <div className="max-w-4xl w-full space-y-8 relative z-10">
        
        {/* Encabezado */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">Stack Técnico</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Herramientas y tecnologías seleccionadas para construir sistemas robustos, automatizaciones y arquitecturas preparadas para producción.
          </p>
        </div>

        {/* Grilla de Tecnologías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Backend & Datos */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
            <h2 className="text-2xl font-semibold text-emerald-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Backend & Base de Datos
            </h2>
            <ul className="space-y-3 text-zinc-300 text-lg">
              <li>• C# & .NET 10</li>
              <li>• ASP.NET Core MVC</li>
              <li>• PostgreSQL</li>
              <li>• Arquitecturas Multi-tenant</li>
            </ul>
          </div>

          {/* Infraestructura & DevOps */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
            <h2 className="text-2xl font-semibold text-emerald-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Infraestructura & Testing
            </h2>
            <ul className="space-y-3 text-zinc-300 text-lg">
              <li>• Docker & Nginx</li>
              <li>• Entornos Linux (Ubuntu)</li>
              <li>• Postman & Swagger</li>
              <li>• Git & CI/CD pipeline básico</li>
            </ul>
          </div>

          {/* Frontend & Web */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors md:col-span-2">
            <h2 className="text-2xl font-semibold text-emerald-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Frontend & UI
            </h2>
            <p className="text-zinc-400 text-lg mb-4">
              Desarrollo de interfaces modernas, PWA y consumo de APIs orientadas a la experiencia del usuario.
            </p>
            <ul className="flex flex-wrap gap-4 text-zinc-300">
              <li className="px-4 py-2 bg-zinc-800/50 rounded-lg">Next.js</li>
              <li className="px-4 py-2 bg-zinc-800/50 rounded-lg">React</li>
              <li className="px-4 py-2 bg-zinc-800/50 rounded-lg">Tailwind CSS</li>
            </ul>
          </div>

        </div>

        {/* CTA (Call to Action) Final */}
        <div className="mt-16 text-center pt-8 border-t border-zinc-800/50">
          <Link 
            href="/contacto" 
            className="inline-block px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded-lg font-bold transition-all shadow-lg shadow-emerald-500/20 hover:scale-105"
          >
            ¡Trabajemos juntos!
          </Link>
        </div>

      </div>
    </main>
  );
}