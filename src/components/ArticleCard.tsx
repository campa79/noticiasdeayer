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
      <article className="group bg-white pb-8 border-b border-[#eeeeee]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Main Cover Photo */}
          <div className="lg:col-span-7">
            <Link href={`/noticia/${article.id}`} className="block relative aspect-16/10 w-full overflow-hidden bg-[#f7f7f7]">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover minimal-photo"
              />
              {totalPhotos > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>{totalPhotos} fotos</span>
                </div>
              )}
            </Link>
          </div>

          {/* Copete & Content Details */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-body text-[#888888] mb-1.5">
                <span className="uppercase tracking-wider font-semibold text-[#111111]">
                  {article.category}
                </span>
                <span>•</span>
                <span>{article.date}</span>
              </div>

              <Link href={`/noticia/${article.id}`} className="block">
                <h2 className="font-headline text-2xl sm:text-3xl font-bold leading-tight text-[#111111] hover:text-[#555555] transition-colors">
                  {article.title}
                </h2>
              </Link>

              <p className="font-body text-sm sm:text-base text-[#444444] leading-relaxed mt-2.5 line-clamp-3">
                {article.copete}
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between text-xs font-body text-[#888888]">
              <span>Por {article.author}</span>
              <Link
                href={`/noticia/${article.id}`}
                className="text-[#111111] font-medium hover:underline flex items-center gap-1"
              >
                <span>Leer artículo</span>
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
    <article className="group bg-white flex flex-col justify-between space-y-3 pb-4">
      <div>
        <Link
          href={`/noticia/${article.id}`}
          className="block relative aspect-16/10 w-full overflow-hidden bg-[#f7f7f7] mb-3"
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover minimal-photo"
          />
          {totalPhotos > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>{totalPhotos}</span>
            </div>
          )}
        </Link>

        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-body text-[#888888] mb-1">
            <span className="uppercase tracking-wider font-semibold text-[#111111]">
              {article.category}
            </span>
            <span>•</span>
            <span>{article.date}</span>
          </div>

          <Link href={`/noticia/${article.id}`} className="block">
            <h3 className="font-headline text-lg sm:text-xl font-bold leading-snug text-[#111111] hover:text-[#555555] transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>

          <p className="font-body text-xs sm:text-sm text-[#555555] leading-relaxed mt-1.5 line-clamp-2">
            {article.copete}
          </p>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between text-xs font-body text-[#888888]">
        <span className="truncate max-w-[130px]">{article.author}</span>
        <Link
          href={`/noticia/${article.id}`}
          className="text-[#111111] font-medium hover:underline flex items-center gap-0.5"
        >
          <span>Leer</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}
