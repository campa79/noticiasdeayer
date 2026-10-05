'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Clock, User, Calendar, ArrowRight, MessageSquare } from 'lucide-react';
import { Article } from '../types/blog';
import { playTypewriterClick } from '../lib/soundEffects';

interface ArticleCardProps {
  article: Article;
  layout?: 'hero' | 'featured' | 'standard' | 'compact';
}

export default function ArticleCard({ article, layout = 'standard' }: ArticleCardProps) {
  const totalPhotos = 1 + (article.gallery?.length || 0);

  if (layout === 'hero') {
    return (
      <article className="group relative bg-[var(--paper-card)] border-2 border-[var(--paper-border)] p-4 sm:p-6 transition-all duration-300 hover:shadow-lg">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[var(--paper-border-light)] font-typewriter text-xs">
          <div className="flex items-center gap-2">
            <span className="vintage-stamp">{article.category}</span>
            <span className="font-bold text-[var(--ink-secondary)]">AÑO {article.epochYear}</span>
          </div>
          <div className="flex items-center gap-3 text-[var(--ink-muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTimeMinutes} min de lectura
            </span>
          </div>
        </div>

        {/* Big Headline */}
        <Link
          href={`/noticia/${article.id}`}
          onClick={playTypewriterClick}
          className="block group"
        >
          {article.subtitle && (
            <p className="font-typewriter text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--ink-accent)] mb-1">
              {article.subtitle}
            </p>
          )}
          <h2 className="font-headline text-2xl sm:text-4xl md:text-5xl font-black leading-tight text-[var(--ink-primary)] group-hover:text-[var(--ink-accent)] transition-colors duration-200 uppercase mb-4">
            {article.title}
          </h2>
        </Link>

        {/* Hero Grid: Main Image & Copete */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cover Photo */}
          <div className="lg:col-span-7">
            <Link
              href={`/noticia/${article.id}`}
              onClick={playTypewriterClick}
              className="block relative overflow-hidden border-2 border-[var(--paper-border)] bg-[var(--paper-subtle)] shadow-xs group"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover vintage-photo group-hover:scale-103 transition-transform duration-500"
                />
                {totalPhotos > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white font-typewriter text-[11px] px-2.5 py-1 rounded-xs flex items-center gap-1.5 shadow-md">
                    <Camera className="w-3.5 h-3.5 text-amber-300" />
                    <span>{totalPhotos} FOTOGRAFÍAS</span>
                  </div>
                )}
              </div>
            </Link>
            {article.coverCaption && (
              <p className="mt-1.5 text-xs italic font-body text-[var(--ink-muted)] border-b border-[var(--paper-border-light)] pb-1">
                {article.coverCaption}
              </p>
            )}
          </div>

          {/* Copete & First Paragraphs Preview */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <p className="font-headline text-base sm:text-lg font-bold leading-relaxed text-[var(--ink-primary)] mb-3 bg-[var(--paper-subtle)]/40 p-3 border-l-3 border-[var(--ink-accent)]">
                {article.copete}
              </p>

              {article.content && article.content[0] && (
                <p className="text-sm font-body leading-relaxed text-[var(--ink-secondary)] line-clamp-3 mb-4">
                  {article.content[0]}
                </p>
              )}
            </div>

            {/* Author Byline & CTA Button */}
            <div className="pt-3 border-t border-[var(--paper-border-light)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {article.authorAvatar ? (
                  <img
                    src={article.authorAvatar}
                    alt={article.author}
                    className="w-9 h-9 rounded-full object-cover border border-[var(--paper-border)] grayscale"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[var(--paper-subtle)] border border-[var(--paper-border)] flex items-center justify-center text-[var(--ink-primary)] font-headline font-bold text-sm">
                    {article.author.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-typewriter text-xs font-bold uppercase text-[var(--ink-primary)]">
                    Por {article.author}
                  </p>
                  {article.authorRole && (
                    <p className="text-[11px] text-[var(--ink-muted)] font-body">
                      {article.authorRole}
                    </p>
                  )}
                </div>
              </div>

              <Link
                href={`/noticia/${article.id}`}
                onClick={playTypewriterClick}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white font-typewriter text-xs uppercase font-bold rounded-xs transition-colors shadow-xs"
              >
                <span>Leer Crónica</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Newspaper Column Card
  return (
    <article className="group bg-[var(--paper-card)] border border-[var(--paper-border)] p-4 flex flex-col justify-between transition-all duration-200 hover:border-[var(--ink-accent)] hover:shadow-md">
      <div>
        {/* Cover Photo */}
        <Link
          href={`/noticia/${article.id}`}
          onClick={playTypewriterClick}
          className="block relative aspect-4/3 w-full overflow-hidden border border-[var(--paper-border)] mb-3 bg-[var(--paper-subtle)]"
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover vintage-photo group-hover:scale-105 transition-transform duration-300"
          />
          {totalPhotos > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/75 text-white font-typewriter text-[10px] px-2 py-0.5 rounded-xs flex items-center gap-1">
              <Camera className="w-3 h-3 text-amber-300" />
              <span>{totalPhotos} FOTOS</span>
            </div>
          )}
          <span className="absolute top-2 left-2 bg-[var(--paper-card)]/90 border border-[var(--paper-border)] font-typewriter text-[10px] uppercase font-bold px-1.5 py-0.5 text-[var(--ink-primary)] shadow-xs">
            {article.category}
          </span>
        </Link>

        {/* Date & Meta */}
        <div className="flex items-center justify-between text-[11px] font-typewriter text-[var(--ink-muted)] mb-1.5">
          <span>{article.date}</span>
          <span className="font-bold text-[var(--ink-secondary)]">AÑO {article.epochYear}</span>
        </div>

        {/* Headline */}
        <Link
          href={`/noticia/${article.id}`}
          onClick={playTypewriterClick}
          className="block"
        >
          <h3 className="font-headline text-lg sm:text-xl font-bold leading-snug text-[var(--ink-primary)] group-hover:text-[var(--ink-accent)] transition-colors duration-200 line-clamp-2 uppercase mb-2">
            {article.title}
          </h3>
        </Link>

        {/* Copete */}
        <p className="font-body text-xs sm:text-sm leading-relaxed text-[var(--ink-secondary)] line-clamp-3 mb-3">
          {article.copete}
        </p>
      </div>

      {/* Footer Byline */}
      <div className="pt-2.5 border-t border-[var(--paper-border-light)] flex items-center justify-between text-xs font-typewriter text-[var(--ink-muted)]">
        <span className="truncate max-w-[150px] font-semibold text-[var(--ink-primary)]">
          {article.author}
        </span>
        <Link
          href={`/noticia/${article.id}`}
          onClick={playTypewriterClick}
          className="text-[var(--ink-accent)] font-bold group-hover:underline flex items-center gap-0.5 text-[11px] uppercase tracking-wider"
        >
          <span>Continuar</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}
