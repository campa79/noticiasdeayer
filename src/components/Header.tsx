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
    <header className="w-full bg-white border-b border-[#eeeeee]">
      {/* Top minimal Masthead */}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-8 text-center relative">
        <Link href="/" className="inline-block group">
          <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111111] uppercase">
            Noticias de Ayer
          </h1>
        </Link>
        <p className="font-body text-xs sm:text-sm text-[#777777] mt-2 italic tracking-wide">
          Diario de archivo y crónicas históricas
        </p>

        {/* Minimal Admin Link */}
        <div className="absolute right-4 top-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs text-[#888888] hover:text-[#111111] transition-colors"
            title="Panel de Administración"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>

      {/* Minimal Navigation & Search */}
      <div className="border-t border-[#f0f0f0] bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Categories */}
          <nav className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar text-xs sm:text-sm font-body">
            {CATEGORIES.map((cat) => {
              const isActive =
                currentCategory === cat ||
                (cat === 'Todas' && currentCategory === 'Todas las Secciones') ||
                (cat === 'Sociedad' && currentCategory === 'Sociedad & Crónicas');
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory && onSelectCategory(cat)}
                  className={`transition-colors whitespace-nowrap pb-0.5 ${
                    isActive
                      ? 'text-[#111111] font-semibold border-b-2 border-[#111111]'
                      : 'text-[#666666] hover:text-[#111111]'
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
              <div className="flex items-center bg-[#fafafa] border border-[#e5e5e5] rounded px-2.5 py-1 text-xs focus-within:border-[#111111] transition-all">
                <Search className="w-3.5 h-3.5 text-[#888888] mr-1.5" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent text-xs font-body text-[#111111] focus:outline-hidden w-24 sm:w-36 placeholder:text-[#999999]"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-xs text-[#888888] hover:text-[#111111] ml-1"
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
