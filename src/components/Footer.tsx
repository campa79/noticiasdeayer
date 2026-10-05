'use client';

import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { CATEGORIES } from './Header';

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--paper-bg)] border-t border-[var(--paper-border)] text-[var(--ink-secondary)] mt-16 py-10 font-body text-xs">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-headline font-bold text-sm text-[var(--ink-primary)] uppercase tracking-wide">
            Noticias de Ayer
          </h4>
          <p className="text-[var(--ink-muted)] mt-0.5">
            Diario y archivo de crónicas históricas.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[var(--ink-muted)]">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <Link key={cat} href="/" className="hover:text-[var(--ink-primary)] transition-colors">
              {cat}
            </Link>
          ))}
          <Link href="/admin" className="hover:text-[var(--ink-accent)] transition-colors flex items-center gap-1 font-medium">
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
