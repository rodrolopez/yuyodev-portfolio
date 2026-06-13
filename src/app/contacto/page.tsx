'use client'

import Image from 'next/image';
import { useState } from 'react';
import { enviarMensajeContacto } from './actions';

export default function ContactoPage() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setStatus({ type: null, message: '' });

    const formData = new FormData(event.currentTarget);
    const result = await enviarMensajeContacto(formData);

    if (result?.error) {
      setStatus({ type: 'error', message: result.error });
    } else if (result?.success) {
      setStatus({ type: 'success', message: '¡Mensaje enviado con éxito! Te responderé a la brevedad.' });
      (event.target as HTMLFormElement).reset(); // Limpia el formulario
    }
    
    setIsPending(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center pt-36 md:pt-40 pb-12 px-6">
      <div className="max-w-5xl w-full relative z-10">
        
        {/* Encabezado */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">Iniciemos un Proyecto</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            ¿Necesitás una solución de software escalable o tenés un sistema complejo en mente? Hablemos para definir la mejor arquitectura.
          </p>
        </div>

        {/* Contenedor a dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Columna Izquierda: Perfil y Datos */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm flex flex-col items-center lg:items-start text-center lg:text-left">
            
            <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden border-4 border-zinc-800/80 shadow-xl">
              <Image 
                src="/profile.jpg" 
                alt="Rodrigo Lopez" 
                fill 
                className="object-cover"
              />
            </div>
            
            <h2 className="text-2xl font-bold text-zinc-100 mb-2">Rodrigo Lopez</h2>
            <p className="text-emerald-400 font-medium mb-6">Desarrollador Backend .NET | Arquitecto de Software</p>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Radicado en San Juan, transformo requerimientos de negocio complejos en código resiliente. Si buscás un aliado técnico para escalar tu empresa, estoy a un mensaje de distancia.
            </p>

            <div className="space-y-4 w-full">
              <a href="mailto:contacto@yuyodev.com.ar" className="flex items-center gap-3 text-zinc-300 hover:text-emerald-400 transition-colors p-3 bg-zinc-800/30 rounded-lg border border-zinc-800/50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                contacto@yuyodev.com.ar
              </a>
              <a href="https://www.linkedin.com/in/rodrigo-tomas-lopez-becerra" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-300 hover:text-emerald-400 transition-colors p-3 bg-zinc-800/30 rounded-lg border border-zinc-800/50">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Columna Derecha: Formulario (Conectado a Server Action) */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">Nombre completo</label>
                <input type="text" id="name" name="name" required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="Ej: Juan Pérez" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">Correo electrónico</label>
                <input type="email" id="email" name="email" required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="juan@empresa.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-2">Mensaje o idea del proyecto</label>
                <textarea id="message" name="message" required rows={5} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none" placeholder="Contame un poco sobre lo que necesitás..."></textarea>
              </div>

              {/* Mensajes de Feedback */}
              {status.type === 'success' && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm text-center">
                  {status.message}
                </div>
              )}
              {status.type === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
                  {status.message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-zinc-950 font-bold py-4 px-8 rounded-lg transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
              >
                {isPending ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}