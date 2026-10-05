'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Shield, Sparkles, Feather, Clock, Search } from 'lucide-react';
import { isSoundEnabled, toggleSound, playTypewriterClick } from '../lib/soundEffects';

interface HeaderProps {
  currentCategory?: string;
  onSelectCategory?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const CATEGORIES = [
  'Todas las Secciones',
  'Historia',
  'Cultura & Música',
  'Ciencia & Misterio',
  'Sociedad & Crónicas',
  'Deportes',
];

export default function Header({
  currentCategory = 'Todas las Secciones',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
}: HeaderProps) {
  const [theme, setTheme] = useState<'sepia' | 'monochrome' | 'parchment' | 'darkroom'>('sepia');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
    const savedTheme = localStorage.getItem('noticias_theme') as 'sepia' | 'monochrome' | 'parchment' | 'darkroom';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: 'sepia' | 'monochrome' | 'parchment' | 'darkroom') => {
    playTypewriterClick();
    setTheme(newTheme);
    localStorage.setItem('noticias_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSoundToggle = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
    if (nextState) playTypewriterClick();
  };

  return (
    <header className="w-full bg-[var(--paper-bg)] text-[var(--ink-primary)] border-b-2 border-[var(--paper-border)] transition-colors duration-300">
      {/* Top Info Bar */}
      <div className="border-b border-[var(--paper-border-light)] py-1.5 px-4 text-xs font-typewriter bg-[var(--paper-subtle)]/30">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 opacity-75" />
              LUNES, 5 DE OCTUBRE DE 1970
            </span>
            <span className="hidden sm:inline text-[var(--ink-muted)]">•</span>
            <span className="hidden sm:inline text-[var(--ink-secondary)]">AÑO LIV — EDICIÓN NACIONAL N° 18.492</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-[var(--ink-secondary)]">
              Clima: 18°C, cielo nuboso con brisa del Río de la Plata
            </span>
            <div className="flex items-center gap-1.5 bg-[var(--paper-card)] border border-[var(--paper-border-light)] px-2 py-0.5 rounded text-[11px]">
              <span className="text-[var(--ink-muted)]">PRECIO:</span>
              <strong className="text-[var(--ink-accent)]">20 CENTAVOS</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Vintage Masthead */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 text-center relative">
        {/* Left vintage ornament / emblem */}
        <div className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col items-center justify-center p-3 border border-double border-[var(--paper-border)] rounded w-28 text-center">
          <Feather className="w-6 h-6 text-[var(--ink-accent)] mb-1" />
          <span className="font-typewriter text-[10px] uppercase font-bold tracking-widest leading-tight">
            Archivo y Crónica
          </span>
          <span className="text-[9px] text-[var(--ink-muted)] mt-0.5">Fundado en 1916</span>
        </div>

        {/* Right Admin & Settings Box */}
        <div className="absolute right-4 top-4 md:top-1/2 md:-translate-y-1/2 flex flex-col items-end gap-2">
          {/* Sound & Theme Controls */}
          <div className="flex items-center gap-1.5 bg-[var(--paper-card)] p-1 border border-[var(--paper-border-light)] rounded shadow-xs text-xs">
            <button
              onClick={handleSoundToggle}
              title={soundOn ? 'Desactivar sonido de máquina de escribir' : 'Activar sonido vintage'}
              className="p-1 hover:bg-[var(--paper-subtle)] rounded transition-colors"
              aria-label="Alternar sonido"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[var(--ink-accent)]" /> : <VolumeX className="w-4 h-4 text-[var(--ink-muted)]" />}
            </button>

            <span className="text-[var(--paper-border-light)]">|</span>

            {/* Theme Selector */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleThemeChange('sepia')}
                className={`w-4 h-4 rounded-full border border-black/40 bg-[#f5eedc] ${theme === 'sepia' ? 'ring-2 ring-[var(--ink-accent)]' : 'opacity-70'}`}
                title="Tono Papel Sepia"
              />
              <button
                onClick={() => handleThemeChange('monochrome')}
                className={`w-4 h-4 rounded-full border border-black/40 bg-[#eae8e3] ${theme === 'monochrome' ? 'ring-2 ring-[var(--ink-accent)]' : 'opacity-70'}`}
                title="Blanco y Negro 1920"
              />
              <button
                onClick={() => handleThemeChange('parchment')}
                className={`w-4 h-4 rounded-full border border-black/40 bg-[#eedfbe] ${theme === 'parchment' ? 'ring-2 ring-[var(--ink-accent)]' : 'opacity-70'}`}
                title="Pergamino Antiguo"
              />
              <button
                onClick={() => handleThemeChange('darkroom')}
                className={`w-4 h-4 rounded-full border border-white/40 bg-[#1a1612] ${theme === 'darkroom' ? 'ring-2 ring-[var(--ink-accent)]' : 'opacity-70'}`}
                title="Redacción Nocturna"
              />
            </div>
          </div>

          <Link
            href="/admin"
            onClick={playTypewriterClick}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--paper-card)] hover:bg-[var(--ink-accent)] hover:text-white border border-[var(--paper-border)] text-[var(--ink-primary)] font-typewriter text-xs font-bold rounded transition-all duration-200 shadow-xs"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Redacción /</span> Admin
          </Link>
        </div>

        {/* Big Masthead Title */}
        <div className="inline-block relative">
          <p className="font-typewriter text-xs sm:text-sm uppercase tracking-[0.25em] text-[var(--ink-muted)] mb-1">
            ❖ DIARIO INDEPENDIENTE DE LA MAÑANA ❖
          </p>

          <Link href="/" onClick={playTypewriterClick} className="block group">
            <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[var(--ink-primary)] hover:text-[var(--ink-accent)] transition-colors duration-200 uppercase drop-shadow-xs">
              Noticias de Ayer
            </h1>
          </Link>

          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-0.5 w-16 sm:w-28 bg-[var(--paper-border)]" />
            <span className="font-typewriter text-[11px] sm:text-xs tracking-widest uppercase text-[var(--ink-secondary)] font-semibold">
              Crónicas, Historia, Cultura y Acontecimientos de Antaño
            </span>
            <div className="h-0.5 w-16 sm:w-28 bg-[var(--paper-border)]" />
          </div>
        </div>
      </div>

      {/* Navigation & Categories Bar */}
      <div className="newspaper-double-border-y bg-[var(--paper-card)] px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 py-2.5">
          {/* Categories */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 no-scrollbar text-xs sm:text-sm font-headline">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playTypewriterClick();
                    if (onSelectCategory) onSelectCategory(cat);
                  }}
                  className={`px-3 py-1 rounded-sm transition-all duration-150 whitespace-nowrap font-semibold uppercase tracking-wider ${
                    isActive
                      ? 'bg-[var(--ink-accent)] text-white shadow-xs'
                      : 'text-[var(--ink-primary)] hover:bg-[var(--paper-subtle)] hover:text-[var(--ink-accent)]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </nav>

          {/* Quick Search */}
          <div className="relative flex items-center">
            {onSearchChange && (
              <div className="flex items-center bg-[var(--paper-bg)] border border-[var(--paper-border-light)] rounded px-2.5 py-1 focus-within:border-[var(--ink-accent)] transition-all">
                <Search className="w-3.5 h-3.5 text-[var(--ink-muted)] mr-2" />
                <input
                  type="text"
                  placeholder="Buscar en hemeroteca..."
                  value={searchQuery}
                  onChange={(e) => {
                    playTypewriterClick();
                    onSearchChange(e.target.value);
                  }}
                  className="bg-transparent text-xs font-typewriter text-[var(--ink-primary)] focus:outline-hidden w-32 sm:w-44 placeholder:text-[var(--ink-muted)]"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink-accent)] ml-1"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
