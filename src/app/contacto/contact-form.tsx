'use client'

import Image from 'next/image';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { enviarMensajeContacto } from './actions';

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

const genericError = 'No pudimos enviar el mensaje. Intentá nuevamente más tarde.';

export default function ContactForm({ siteKey, action }: { siteKey: string; action: string }) {
  const submitting = useRef(false);
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState('');
  const [widgetError, setWidgetError] = useState(false);

  useEffect(() => {
    if (!siteKey || !action || scriptReady) return;
    const timeout = window.setTimeout(() => setWidgetError(true), 15000);
    return () => window.clearTimeout(timeout);
  }, [siteKey, action, scriptReady]);

  useEffect(() => {
    if (!scriptReady || !widget.current || !window.turnstile || !siteKey || !action) return;
    try {
      widgetId.current = window.turnstile.render(widget.current, {
        sitekey: siteKey, action, theme: 'dark', size: 'flexible',
        'response-field': false,
        callback: (value: string) => { setToken(value); setWidgetError(false); },
        'expired-callback': () => { setToken(''); },
        'error-callback': () => { setToken(''); setWidgetError(true); },
        'timeout-callback': () => { setToken(''); setWidgetError(true); },
      });
    } catch { window.setTimeout(() => setWidgetError(true), 0); }
    return () => {
      if (widgetId.current !== null) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [scriptReady, siteKey, action]);
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    if (!token) {
      setStatus({ type: 'error', message: 'Completá la verificación de seguridad.' });
      return;
    }
    submitting.current = true;
    setIsPending(true);
    setStatus({ type: null, message: '' });
    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      formData.set('cf-turnstile-response', token);
      const result = await enviarMensajeContacto(formData);
      if ('success' in result && result.success === true) {
        setStatus({ type: 'success', message: '¡Mensaje aceptado para envío! Te responderé a la brevedad.' });
        form.reset();
      } else {
        setStatus({ type: 'error', message: genericError });
      }
    } catch {
      setStatus({ type: 'error', message: genericError });
    } finally {
      setToken('');
      try {
        if (widgetId.current !== null) window.turnstile?.reset(widgetId.current);
      } catch { setWidgetError(true); }
      submitting.current = false;
      setIsPending(false);
    }
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
              Hola! Soy de San Juan, Argentina. Transformo requerimientos de negocio complejos en código resiliente. Si buscás un aliado técnico para escalar tu empresa, estoy a un mensaje de distancia.
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
            <form onSubmit={handleSubmit} aria-busy={isPending} className="space-y-6">
              <div className="sr-only">
                <label htmlFor="website">Dejá este campo vacío (protección antispam)</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" maxLength={200} />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">Nombre completo</label>
                <input type="text" id="name" name="name" required minLength={2} maxLength={100} autoComplete="name" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="Ej: Juan Pérez" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">Correo electrónico</label>
                <input type="email" id="email" name="email" required maxLength={254} autoComplete="email" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="juan@empresa.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-2">Mensaje o idea del proyecto</label>
                <textarea id="message" name="message" required minLength={10} maxLength={5000} rows={5} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none" placeholder="Contame un poco sobre lo que necesitás..."></textarea>
              </div>

              {siteKey && action && (
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                  onReady={() => setScriptReady(true)} onError={() => setWidgetError(true)} />
              )}
              <div ref={widget} className="min-h-16" />
              <p role="status" className="text-sm text-zinc-400">
                {!siteKey || !action || widgetError
                  ? 'Verificación de seguridad no disponible. Recargá la página para reintentar.'
                  : token ? 'Verificación completada.' : 'Completá la verificación de seguridad para enviar.'}
              </p>
              <noscript>Necesitás JavaScript para verificar y enviar el formulario.</noscript>
              {/* Mensajes de Feedback */}
              <div role="status" aria-live="polite" aria-atomic="true">
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

              </div>

              <button
                type="submit"
                disabled={isPending || !token || widgetError}
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