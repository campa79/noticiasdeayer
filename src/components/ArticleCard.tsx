'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, ArrowRight } from 'lucide-react';
import { Article } from '../types/blog';

interface ArticleCardProps {
  article: Article;
  layout?: 'hero' | 'standard';
}

export default function ArticleCard({ article, layout = 'standard' }: ArticleCardProps) {
  const totalPhotos = 1 + (article.gallery?.length || 0);

  if (layout === 'hero') {
    return (
      <article className="group bg-[var(--paper-card)] border border-[var(--paper-border)] p-5 sm:p-8 transition-shadow duration-200 hover:shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Main Cover Photo */}
          <div className="lg:col-span-7">
            <Link href={`/noticia/${article.id}`} className="block relative aspect-16/10 w-full overflow-hidden bg-[var(--paper-subtle)]">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover vintage-photo group-hover:scale-102 transition-transform duration-300"
              />
              {totalPhotos > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-body px-2 py-0.5 rounded flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>{totalPhotos} fotos</span>
                </div>
              )}
            </Link>
          </div>

          {/* Copete & Content Details */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-body text-[var(--ink-muted)] mb-2">
                <span className="uppercase tracking-wider font-semibold text-[var(--ink-accent)]">
                  {article.category}
                </span>
                <span>•</span>
                <span>{article.date}</span>
              </div>

              <Link href={`/noticia/${article.id}`} className="block">
                <h2 className="font-headline text-2xl sm:text-3xl font-bold leading-tight text-[var(--ink-primary)] group-hover:text-[var(--ink-accent)] transition-colors duration-150">
                  {article.title}
                </h2>
              </Link>

              <p className="font-body text-sm text-[var(--ink-secondary)] leading-relaxed mt-3 line-clamp-3">
                {article.copete}
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--paper-border)] flex items-center justify-between text-xs font-body text-[var(--ink-muted)]">
              <span>Por {article.author}</span>
              <Link
                href={`/noticia/${article.id}`}
                className="text-[var(--ink-primary)] font-medium group-hover:text-[var(--ink-accent)] flex items-center gap-1"
              >
                <span>Leer más</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Minimalist Card
  return (
    <article className="group bg-[var(--paper-card)] border border-[var(--paper-border)] flex flex-col justify-between transition-all duration-200 hover:shadow-xs">
      <div>
        <Link
          href={`/noticia/${article.id}`}
          className="block relative aspect-16/10 w-full overflow-hidden bg-[var(--paper-subtle)]"
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover vintage-photo group-hover:scale-103 transition-transform duration-300"
          />
          {totalPhotos > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-body px-1.5 py-0.5 rounded flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>{totalPhotos} fotos</span>
            </div>
          )}
        </Link>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-[11px] font-body text-[var(--ink-muted)] mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[var(--ink-accent)]">
              {article.category}
            </span>
            <span>•</span>
            <span>{article.date}</span>
          </div>

          <Link href={`/noticia/${article.id}`} className="block">
            <h3 className="font-headline text-lg sm:text-xl font-bold leading-snug text-[var(--ink-primary)] group-hover:text-[var(--ink-accent)] transition-colors duration-150 line-clamp-2">
              {article.title}
            </h3>
          </Link>

          <p className="font-body text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed mt-2 line-clamp-2">
            {article.copete}
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-[var(--paper-border)] flex items-center justify-between text-xs font-body text-[var(--ink-muted)]">
        <span className="truncate max-w-[140px]">{article.author}</span>
        <Link
          href={`/noticia/${article.id}`}
          className="text-[var(--ink-primary)] font-medium group-hover:text-[var(--ink-accent)] flex items-center gap-0.5"
        >
          <span>Leer</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}
