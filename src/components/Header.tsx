'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Shield } from 'lucide-react';

interface HeaderProps {
  currentCategory?: string;
  onSelectCategory?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const CATEGORIES = [
  'Todas',
  'Historia',
  'Cultura & Música',
  'Ciencia & Misterio',
  'Sociedad',
  'Deportes',
];

export default function Header({
  currentCategory = 'Todas',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="w-full bg-[var(--paper-bg)] border-b border-[var(--paper-border)]">
      {/* Top minimal Masthead */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-6 text-center relative">
        <Link href="/" className="inline-block group">
          <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--ink-primary)] group-hover:text-[var(--ink-accent)] transition-colors duration-150 uppercase">
            Noticias de Ayer
          </h1>
        </Link>
        <p className="font-body text-xs sm:text-sm text-[var(--ink-muted)] mt-1.5 italic tracking-wide">
          Diario de archivo, crónicas y acontecimientos de época
        </p>

        {/* Minimal Admin Link in the corner */}
        <div className="absolute right-4 top-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-[11px] font-body text-[var(--ink-muted)] hover:text-[var(--ink-accent)] transition-colors"
            title="Panel de Redacción"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>

      {/* Minimal Navigation & Search */}
      <div className="border-t border-[var(--paper-border)] bg-[var(--paper-bg)]">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Categories */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar text-xs sm:text-sm font-body">
            {CATEGORIES.map((cat) => {
              const isActive =
                currentCategory === cat ||
                (cat === 'Todas' && currentCategory === 'Todas las Secciones') ||
                (cat === 'Sociedad' && currentCategory === 'Sociedad & Crónicas');
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory && onSelectCategory(cat)}
                  className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap text-xs font-medium ${
                    isActive
                      ? 'bg-[var(--ink-primary)] text-white'
                      : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--paper-subtle)]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </nav>

          {/* Minimal Search */}
          {onSearchChange && (
            <div className="relative flex items-center">
              <div className="flex items-center bg-[var(--paper-card)] border border-[var(--paper-border)] rounded-full px-3 py-1 text-xs focus-within:border-[var(--ink-primary)] transition-all">
                <Search className="w-3.5 h-3.5 text-[var(--ink-muted)] mr-1.5" />
                <input
                  type="text"
                  placeholder="Buscar en el archivo..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent text-xs font-body text-[var(--ink-primary)] focus:outline-hidden w-28 sm:w-40 placeholder:text-[var(--ink-muted)]"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink-primary)] ml-1"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
