'use client';

import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { CATEGORIES } from './Header';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#eeeeee] text-[#777777] mt-20 py-10 font-body text-xs">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-headline font-bold text-sm text-[#111111] uppercase tracking-wide">
            Noticias de Ayer
          </h4>
          <p className="text-[#888888] mt-0.5">
            Diario de crónicas históricas.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[#888888]">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <Link key={cat} href="/" className="hover:text-[#111111] transition-colors">
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
