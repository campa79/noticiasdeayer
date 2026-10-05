'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Camera, Share2, Printer, Check, MessageSquare, Send } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ArticleCard from '../../../components/ArticleCard';
import PhotoGalleryModal from '../../../components/PhotoGalleryModal';
import { Article } from '../../../types/blog';
import {
  getStoredArticles,
  getArticleByIdOrSlug,
  addCommentToArticle,
  incrementArticleViews,
} from '../../../lib/storage';

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Comment Form State
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentCity, setCommentCity] = useState('');
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const articles = getStoredArticles();
    setAllArticles(articles);

    if (id) {
      const found = getArticleByIdOrSlug(id);
      if (found) {
        setArticle(found);
        incrementArticleViews(found.id);
      }
    }

    const handleUpdate = () => {
      if (id) {
        const found = getArticleByIdOrSlug(id);
        if (found) setArticle(found);
      }
    };
    window.addEventListener('noticias_articles_updated', handleUpdate);
    return () => window.removeEventListener('noticias_articles_updated', handleUpdate);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--paper-bg)] text-[var(--ink-primary)]">
        <Header />
        <main className="grow max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="bg-[var(--paper-card)] border border-[var(--paper-border)] p-8 sm:p-12">
            <h2 className="font-headline text-2xl font-bold mb-3">
              Crónica no encontrada
            </h2>
            <p className="font-body text-sm text-[var(--ink-muted)] mb-6">
              El artículo solicitado no existe o fue retirado del archivo.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white font-body text-xs rounded transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la portada</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const allPhotos = [
    {
      id: 'cover',
      url: article.coverImage,
      caption: article.coverCaption || article.title,
    },
    ...(article.gallery || []),
  ];

  const handleOpenGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.copete,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;

    addCommentToArticle(article.id, {
      author: commentAuthor.trim(),
      city: commentCity.trim() || 'Lector',
      text: commentText.trim(),
    });

    setCommentAuthor('');
    setCommentCity('');
    setCommentText('');

    const updated = getArticleByIdOrSlug(article.id);
    if (updated) setArticle(updated);
  };

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper-bg)] text-[var(--ink-primary)]">
      <Header />

      <main className="grow max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-2 mb-8 text-xs font-body text-[var(--ink-muted)]">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-[var(--ink-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Portada</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <span className="uppercase font-semibold text-[var(--ink-accent)]">{article.category}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
        </div>

        {/* Article Container */}
        <article className="space-y-8">
          {/* Header & Title */}
          <div className="space-y-4">
            {article.subtitle && (
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-[var(--ink-accent)]">
                {article.subtitle}
              </p>
            )}

            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[var(--ink-primary)]">
              {article.title}
            </h1>

            <p className="font-body text-lg sm:text-xl text-[var(--ink-secondary)] italic leading-relaxed pt-2 border-l-2 border-[var(--ink-accent)] pl-4">
              «{article.copete}»
            </p>
          </div>

          {/* Byline & Share Tools */}
          <div className="py-4 border-y border-[var(--paper-border)] flex flex-wrap items-center justify-between gap-4 text-xs font-body text-[var(--ink-muted)]">
            <div>
              <span className="font-medium text-[var(--ink-primary)]">Por {article.author}</span>
              {article.authorRole && <span> — {article.authorRole}</span>}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="hover:text-[var(--ink-primary)] transition-colors flex items-center gap-1"
                title="Imprimir"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>

              <button
                onClick={handleShare}
                className="hover:text-[var(--ink-primary)] transition-colors flex items-center gap-1"
                title="Compartir enlace"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copiado' : 'Compartir'}</span>
              </button>
            </div>
          </div>

          {/* Main Cover Photo */}
          <div>
            <div
              onClick={() => handleOpenGallery(0)}
              className="cursor-pointer relative overflow-hidden bg-[var(--paper-subtle)] group border border-[var(--paper-border)]"
            >
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full max-h-[500px] object-cover vintage-photo group-hover:scale-101 transition-transform duration-300"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-body px-2 py-0.5 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3 h-3" />
                <span>Ampliar foto</span>
              </div>
            </div>
            {article.coverCaption && (
              <p className="mt-2 font-body text-xs italic text-[var(--ink-muted)]">
                {article.coverCaption}
              </p>
            )}
          </div>

          {/* Additional Photos Gallery (if any) */}
          {article.gallery && article.gallery.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3 text-xs font-body text-[var(--ink-muted)]">
                <Camera className="w-3.5 h-3.5 text-[var(--ink-accent)]" />
                <span className="font-semibold uppercase tracking-wider">Fotografías del reporte ({article.gallery.length})</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {article.gallery.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    onClick={() => handleOpenGallery(idx + 1)}
                    className="cursor-pointer border border-[var(--paper-border)] overflow-hidden bg-[var(--paper-subtle)] group"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.caption || `Foto ${idx + 1}`}
                        className="w-full h-full object-cover vintage-photo group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {photo.caption && (
                      <p className="p-1.5 font-body text-[11px] italic text-[var(--ink-secondary)] line-clamp-1">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paragraphs */}
          <div className="space-y-6 text-base sm:text-lg leading-relaxed font-body text-[var(--ink-primary)] pt-4">
            {article.content && article.content.length > 0 ? (
              article.content.map((p, idx) => (
                <p key={idx} className={idx === 0 ? 'newspaper-dropcap' : ''}>
                  {p}
                </p>
              ))
            ) : (
              <p>{article.copete}</p>
            )}

            {article.pullQuote && (
              <blockquote className="vintage-pullquote my-6">
                {article.pullQuote}
              </blockquote>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-[var(--paper-border)] flex flex-wrap items-center gap-1.5 text-xs font-body text-[var(--ink-muted)]">
              <span>Etiquetas:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[var(--paper-subtle)] border border-[var(--paper-border)] px-2 py-0.5 rounded text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments / Cartas de Lectores */}
          <section className="pt-10 border-t border-[var(--paper-border)]">
            <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--ink-accent)]" />
              Comentarios ({article.comments?.length || 0})
            </h3>

            {/* List */}
            <div className="space-y-4 mb-8">
              {article.comments && article.comments.length > 0 ? (
                article.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-[var(--paper-card)] border border-[var(--paper-border)] p-4 rounded-xs"
                  >
                    <div className="flex items-center justify-between text-xs font-body text-[var(--ink-muted)] mb-1.5">
                      <strong className="text-[var(--ink-primary)] font-medium">{comment.author}</strong>
                      <span>{comment.date}</span>
                    </div>
                    <p className="font-body text-sm text-[var(--ink-secondary)] italic">
                      «{comment.text}»
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs font-body italic text-[var(--ink-muted)]">
                  No hay comentarios aún. Deja tu mensaje a continuación.
                </p>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleCommentSubmit} className="bg-[var(--paper-card)] border border-[var(--paper-border)] p-5 space-y-3">
              <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)]">
                Escribir un comentario
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Tu nombre *"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="bg-[var(--paper-bg)] border border-[var(--paper-border)] px-3 py-1.5 text-xs font-body text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-primary)] rounded-xs"
                />
                <input
                  type="text"
                  placeholder="Ciudad / Barrio (opcional)"
                  value={commentCity}
                  onChange={(e) => setCommentCity(e.target.value)}
                  className="bg-[var(--paper-bg)] border border-[var(--paper-border)] px-3 py-1.5 text-xs font-body text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-primary)] rounded-xs"
                />
              </div>

              <textarea
                required
                rows={3}
                placeholder="Escribe tu mensaje..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] px-3 py-2 text-xs font-body text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-primary)] rounded-xs"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white text-xs font-body font-medium rounded-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>Publicar comentario</span>
              </button>
            </form>
          </section>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-14 pt-10 border-t border-[var(--paper-border)]">
            <h3 className="font-headline text-xl font-bold uppercase mb-6">
              Otras Crónicas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} layout="standard" />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Lightbox Modal */}
      <PhotoGalleryModal
        isOpen={galleryOpen}
        initialIndex={galleryIndex}
        images={allPhotos}
        onClose={() => setGalleryOpen(false)}
        articleTitle={article.title}
      />

      <Footer />
    </div>
  );
}
