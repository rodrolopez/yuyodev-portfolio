// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Enlace al Home con el Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src="/yuyodev-logo.png" // Ruta en public/
            alt="YuyoDev Logo"
            width={60} // Ajusta el tamaño según tu logo
            height={60} // Ajusta el tamaño según tu logo
            className="invert" // <-- AQUÍ ESTÁ LA MAGIA: Esto hace el logo blanco
          />
        </Link>

        {/* Menú de Navegación (Placeholder para el futuro) */}
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/servicios" className="hover:text-emerald-400 transition-colors">Servicios</Link>
          <Link href="/stack" className="hover:text-emerald-400 transition-colors">Stack</Link>
          <Link href="/contacto" className="hover:text-emerald-400 transition-colors">Contacto</Link>
        </div>
      </nav>
    </header>
  );
}