import type { Metadata } from "next";
import React from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noticiasdeayer.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NOTICIAS DE AYER — Diario Histórico y Crónicas del Pasado",
    template: "%s | NOTICIAS DE AYER",
  },
  description:
    "Periódico digital independiente con crónicas, historia, cultura, ciencia y acontecimientos de época. Archivo histórico y hemeroteca de colección.",
  keywords: [
    "noticias de ayer",
    "diario historico",
    "cronicas del pasado",
    "hemeroteca digital",
    "periodico vintage",
    "historia universal",
    "noticias retro",
    "blog de historia",
    "archivo periodistico",
  ],
  authors: [{ name: "Redacción de Noticias de Ayer", url: siteUrl }],
  creator: "Noticias de Ayer",
  publisher: "Noticias de Ayer",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    title: "NOTICIAS DE AYER — Diario Histórico y Crónicas del Pasado",
    description:
      "Periódico digital con crónicas, historia, cultura y grandes hitos de la humanidad.",
    siteName: "Noticias de Ayer",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NOTICIAS DE AYER — Diario Histórico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOTICIAS DE AYER — Diario Histórico",
    description:
      "Crónicas de época, historia y acontecimientos de antaño en formato periódico tradicional.",
    images: ["/og-image.jpg"],
  },
  category: "News & History",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org Structured Data for Google Rich Snippets
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Noticias de Ayer",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "Diario digital independiente dedicado a la recopilación, archivo y publicación de crónicas y acontecimientos históricos.",
    sameAs: [],
    publishingPrinciples: `${siteUrl}/`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="es" className="h-full bg-white antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#111111]">{children}</body>
    </html>
  );
}
