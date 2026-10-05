import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOTICIAS DE AYER — Diario Histórico y Crónicas del Pasado",
  description: "Periódico digital vintage con crónicas, historia, cultura, deportes y acontecimientos de antaño. Edición de colección.",
  keywords: ["noticias de ayer", "blog vintage", "historia", "crónicas", "hemeroteca", "periódico retro"],
  authors: [{ name: "Redacción de Noticias de Ayer" }],
  openGraph: {
    title: "NOTICIAS DE AYER — Diario Histórico",
    description: "Crónicas, historia y acontecimientos de antaño en formato periódico tradicional.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased" data-theme="sepia">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
