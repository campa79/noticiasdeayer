'use client';

import React from 'react';
import Link from 'next/link';
import { Feather, Shield, ArrowUp, Send, BookOpen, Heart } from 'lucide-react';
import { CATEGORIES } from './Header';
import { playTypewriterClick, playTypewriterBell } from '../lib/soundEffects';

export default function Footer() {
  const scrollToTop = () => {
    playTypewriterClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTelegramSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    playTypewriterBell();
    alert('¡Suscripción archivada! Recibirá los próximos cables y ediciones extraordinarias en su hemeroteca.');
  };

  return (
    <footer className="w-full bg-[var(--paper-subtle)] border-t-4 border-double border-[var(--paper-border)] text-[var(--ink-primary)] mt-16 transition-colors duration-300">
      {/* Newspaper Colophon Banner */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b-2 border-[var(--paper-border-light)]">
          {/* Column 1: Editorial Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <Feather className="w-6 h-6 text-[var(--ink-accent)]" />
              <h4 className="font-headline text-2xl font-black uppercase tracking-tight">
                Noticias de Ayer
              </h4>
            </div>
            <p className="font-body text-sm leading-relaxed text-[var(--ink-secondary)]">
              Órgano de difusión y archivo de crónicas, efemérides y sucesos inolvidables del siglo pasado. Impreso con tipografía móvil y tinta indeleble para la posteridad.
            </p>
            <div className="font-typewriter text-xs text-[var(--ink-muted)] space-y-1 pt-2">
              <p>• Dirección General: Redacción de Noticias de Ayer</p>
              <p>• Imprenta: Talleres Gráficos del Pasado S.A.</p>
              <p>• Registro Nacional de la Propiedad Intelectual N° 84.102</p>
            </div>
          </div>

          {/* Column 2: Sections */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-typewriter text-xs uppercase font-bold tracking-widest text-[var(--ink-accent)] border-b border-[var(--paper-border-light)] pb-1">
              Secciones del Diario
            </h5>
            <ul className="space-y-1.5 font-headline text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href="/"
                    onClick={playTypewriterClick}
                    className="hover:text-[var(--ink-accent)] transition-colors hover:underline"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Telegram Subscription & Admin */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-typewriter text-xs uppercase font-bold tracking-widest text-[var(--ink-accent)] border-b border-[var(--paper-border-light)] pb-1">
              Suscripción por Despacho
            </h5>
            <p className="font-body text-xs text-[var(--ink-secondary)]">
              Reciba las ediciones extraordinarias y los avisos de última hora directamente en su correo.
            </p>
            <form onSubmit={handleTelegramSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  required
                  placeholder="su.correo@ejemplo.com"
                  className="grow bg-[var(--paper-card)] border border-[var(--paper-border)] px-3 py-1.5 text-xs font-typewriter text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-accent)] rounded-l-xs"
                />
                <button
                  type="submit"
                  className="bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white px-3 py-1.5 text-xs font-typewriter uppercase font-bold transition-colors rounded-r-xs flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Suscribir</span>
                </button>
              </div>
            </form>

            <div className="pt-2">
              <Link
                href="/admin"
                onClick={playTypewriterClick}
                className="inline-flex items-center gap-1.5 text-xs font-typewriter text-[var(--ink-muted)] hover:text-[var(--ink-accent)] hover:underline"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Panel de Administración / Redacción</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 font-typewriter text-xs text-[var(--ink-muted)]">
          <p>
            © NOTICIAS DE AYER — Todos los derechos reservados bajo la Ley de Prensa.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[var(--ink-accent)] transition-colors uppercase font-bold tracking-wider"
          >
            <span>Volver al Encabezado</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
