import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YuyoDev | Arquitectura SaaS y Soluciones Empresariales",
  description: "Portfolio de Rodrigo Lopez. Especialista en desarrollo backend con .NET, C#, PostgreSQL y plataformas multi-tenant. Soluciones de software escalables y resilientes.",
  keywords: ["desarrollo backend", ".NET", "C#", "SaaS", "PostgreSQL", "San Juan", "Argentina", "desarrollo de software", "automatización RPA"],
  icons: {
    icon: "/favicon.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Este es el "Gancho" del SEO Estructurado (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "YuyoDev",
    "image": "https://yuyodev.com.ar/yuyodev-logo.png",
    "description": "Servicios de arquitectura de software, desarrollo backend en .NET, sistemas SaaS multi-tenant y automatización RPA.",
    "founder": {
      "@type": "Person",
      "name": "Rodrigo Lopez"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Juan",
      "addressRegion": "SJ",
      "addressCountry": "AR"
    },
    "url": "https://yuyodev.com.ar",
    "priceRange": "$$",
    "knowsAbout": ["C#", ".NET Core", "PostgreSQL", "Docker", "Arquitectura Multi-tenant", "Sistemas de Auditoría", "Desarrollador de Software", "Automatización RPA", "Desarrollo Backend", "SaaS", "Software Empresarial", "Paginas Web Corporativas", "Paginas web para empresas", "Desarrollo de Software a Medida"],
  };

  return (
    <html lang="es" className="h-full antialiased">
      <head>
        {/* Inyectamos el JSON-LD de forma segura en el Head del documento */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.className} min-h-full flex flex-col bg-zinc-950 text-zinc-100`}>
        <Header />
        {children}
      </body>
    </html>
  );
}