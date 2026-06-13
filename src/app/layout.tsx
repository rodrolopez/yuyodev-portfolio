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
  keywords: ["desarrollo backend", ".NET", "C#", "SaaS", "PostgreSQL", "San Juan", "Argentina", "desarrollo de software"],
  icons: {
    icon: "/favicon.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className={`${geistSans.className} min-h-full flex flex-col bg-zinc-950 text-zinc-100`}>
        <Header />
        {children}
      </body>
    </html>
  );
}