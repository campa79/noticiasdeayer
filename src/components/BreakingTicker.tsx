'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Radio, ChevronRight, Zap } from 'lucide-react';
import { Article } from '../types/blog';
import { playTypewriterClick } from '../lib/soundEffects';

interface BreakingTickerProps {
  articles: Article[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const headlines = articles.length > 0
    ? articles.slice(0, 5)
    : [
        {
          id: '1',
          slug: '#',
          title: 'EL ARCHIVO HISTÓRICO INCORPORA NUEVOS DOCUMENTOS DE LA ÉPOCA DE ORO',
          date: 'Archivo General',
          epochYear: 1970,
        },
      ];

  useEffect(() => {
    if (headlines.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [headlines.length]);

  const current = headlines[currentIndex];

  return (
    <div className="w-full bg-[var(--paper-subtle)] border-b border-[var(--paper-border-light)] py-1.5 px-4 font-typewriter text-xs text-[var(--ink-primary)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 overflow-hidden">
        {/* Ticker Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-[var(--ink-accent)] text-white px-2.5 py-0.5 rounded-xs uppercase font-bold tracking-widest text-[11px] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping inline-block" />
          <Radio className="w-3.5 h-3.5" />
          <span>CABLEGRAMA URGENTE:</span>
        </div>

        {/* Current headline ticker */}
        <div className="grow truncate flex items-center gap-2">
          {current && (
            <Link
              href={`/noticia/${current.id}`}
              onClick={playTypewriterClick}
              className="hover:text-[var(--ink-accent)] truncate hover:underline flex items-center gap-1.5 transition-colors"
            >
              <span className="font-bold text-[var(--ink-secondary)]">[{current.epochYear}]:</span>
              <span className="truncate uppercase font-semibold">{current.title}</span>
            </Link>
          )}
        </div>

        {/* Controls */}
        <div className="hidden sm:flex items-center gap-1 shrink-0 text-[11px] text-[var(--ink-muted)]">
          <span>
            {currentIndex + 1} de {headlines.length}
          </span>
          <button
            onClick={() => {
              playTypewriterClick();
              setCurrentIndex((prev) => (prev + 1) % headlines.length);
            }}
            className="p-0.5 hover:text-[var(--ink-primary)] hover:bg-[var(--paper-card)] rounded"
            title="Siguiente cablegrama"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
