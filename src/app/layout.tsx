import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOTICIAS DE AYER — Diario Histórico y Crónicas del Pasado",
  description: "Periódico digital con crónicas, historia, cultura y acontecimientos de antaño.",
  keywords: ["noticias de ayer", "blog minimalista", "historia", "crónicas", "hemeroteca"],
  authors: [{ name: "Redacción de Noticias de Ayer" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-white antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#111111]">{children}</body>
    </html>
  );
}
