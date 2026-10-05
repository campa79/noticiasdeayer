'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Camera,
  Share2,
  Printer,
  Volume2,
  VolumeX,
  MessageSquare,
  Send,
  Bookmark,
  Sparkles,
  Check,
} from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BreakingTicker from '../../../components/BreakingTicker';
import ArticleCard from '../../../components/ArticleCard';
import PhotoGalleryModal from '../../../components/PhotoGalleryModal';
import { Article, Comment } from '../../../types/blog';
import {
  getStoredArticles,
  getArticleByIdOrSlug,
  addCommentToArticle,
  incrementArticleViews,
} from '../../../lib/storage';
import {
  playTypewriterClick,
  playTypewriterBell,
  playPageTurn,
} from '../../../lib/soundEffects';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Audio Speech Reader State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Comment Form State
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentCity, setCommentCity] = useState('');
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    playPageTurn();
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
    return () => {
      window.removeEventListener('noticias_articles_updated', handleUpdate);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--paper-bg)] text-[var(--ink-primary)]">
        <Header />
        <main className="grow max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-[var(--paper-card)] border-2 border-[var(--paper-border)] p-8 sm:p-12 shadow-md">
            <span className="vintage-stamp mb-4 inline-block">EDICIÓN EXTRAVIADA</span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold uppercase mb-4">
              La Crónica Solicitada No Se Encuentra en el Archivo
            </h2>
            <p className="font-body text-base text-[var(--ink-secondary)] mb-6">
              Es posible que el ejemplar haya sido retirado de circulación o que el número de archivo sea incorrecto.
            </p>
            <Link
              href="/"
              onClick={playTypewriterClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white font-typewriter text-xs uppercase font-bold rounded-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la Portada del Diario</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Combine cover image with additional gallery photos
  const allPhotos = [
    {
      id: 'cover',
      url: article.coverImage,
      caption: article.coverCaption || article.title,
    },
    ...(article.gallery || []),
  ];

  const handleOpenGallery = (index: number) => {
    playTypewriterClick();
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  // Audio Narrator using Web Speech Synthesis
  const handleToggleAudio = () => {
    playTypewriterClick();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('La síntesis de voz no está disponible en este navegador.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${article.title}. ${article.copete}. ${article.content.join(' ')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95; // slightly slower vintage radio cadence
    utterance.pitch = 0.9;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handlePrint = () => {
    playTypewriterClick();
    window.print();
  };

  const handleShare = async () => {
    playTypewriterClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.copete,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;

    playTypewriterBell();
    addCommentToArticle(article.id, {
      author: commentAuthor.trim(),
      city: commentCity.trim() || 'Lector Porteño',
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
      <BreakingTicker articles={allArticles} />

      <main className="grow max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-2 mb-6 font-typewriter text-xs text-[var(--ink-muted)] border-b border-[var(--paper-border-light)] pb-3">
          <Link
            href="/"
            onClick={playTypewriterClick}
            className="inline-flex items-center gap-1.5 text-[var(--ink-primary)] hover:text-[var(--ink-accent)] font-bold uppercase transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Portada</span>
          </Link>

          <div className="flex items-center gap-2">
            <span>SECCIÓN:</span>
            <span className="font-bold text-[var(--ink-accent)] uppercase">{article.category}</span>
            <span>•</span>
            <span>AÑO {article.epochYear}</span>
          </div>
        </div>

        {/* Article Paper Container */}
        <article className="bg-[var(--paper-card)] border-2 border-[var(--paper-border)] p-5 sm:p-8 md:p-12 shadow-lg">
          {/* Top Metadata & Stamps */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-[var(--paper-border)] font-typewriter text-xs">
            <div className="flex items-center gap-2">
              <span className="vintage-stamp">{article.category}</span>
              <span className="font-bold text-[var(--ink-secondary)] bg-[var(--paper-subtle)] px-2 py-0.5 border border-[var(--paper-border-light)]">
                {article.edition || 'Edición Especial'}
              </span>
            </div>

            {/* Actions: Audio, Print, Share */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleAudio}
                className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-xs font-bold transition-all ${
                  isSpeaking
                    ? 'bg-[var(--ink-accent)] text-white border-[var(--ink-accent)] animate-pulse'
                    : 'bg-[var(--paper-bg)] border-[var(--paper-border)] text-[var(--ink-primary)] hover:bg-[var(--paper-subtle)]'
                }`}
                title={isSpeaking ? 'Detener lectura radial' : 'Escuchar crónica con locutor de radio'}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Detener' : 'Escuchar Crónica'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="no-print inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--paper-bg)] border border-[var(--paper-border)] text-[var(--ink-primary)] hover:bg-[var(--paper-subtle)] rounded-xs font-bold transition-colors"
                title="Imprimir artículo en formato papel"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--paper-bg)] border border-[var(--paper-border)] text-[var(--ink-primary)] hover:bg-[var(--paper-subtle)] rounded-xs font-bold transition-colors"
                title="Compartir o copiar enlace"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedLink ? '¡Copiado!' : 'Compartir'}</span>
              </button>
            </div>
          </div>

          {/* Subtitle / Antetítulo */}
          {article.subtitle && (
            <p className="font-typewriter text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[var(--ink-accent)] mb-2">
              — {article.subtitle} —
            </p>
          )}

          {/* Big Headline */}
          <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-black leading-tight text-[var(--ink-primary)] uppercase mb-6 tracking-tight">
            {article.title}
          </h1>

          {/* Copete / Resumen destacado */}
          <div className="bg-[var(--paper-subtle)]/50 p-4 sm:p-6 border-l-4 border-[var(--ink-accent)] border-y border-r border-[var(--paper-border-light)] mb-8">
            <p className="font-headline text-lg sm:text-xl md:text-2xl font-bold leading-relaxed text-[var(--ink-primary)] italic">
              «{article.copete}»
            </p>
          </div>

          {/* Author Byline & Publication Date */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 mb-8 border-y-2 border-[var(--paper-border-light)] font-typewriter text-xs">
            <div className="flex items-center gap-3">
              {article.authorAvatar ? (
                <img
                  src={article.authorAvatar}
                  alt={article.author}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[var(--paper-border)] grayscale"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[var(--paper-subtle)] border-2 border-[var(--paper-border)] flex items-center justify-center font-headline font-bold text-lg">
                  {article.author.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-bold uppercase text-[var(--ink-primary)] text-sm">
                  Por {article.author}
                </p>
                <p className="text-[var(--ink-muted)] font-body">
                  {article.authorRole || 'Redactor Especial'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[var(--ink-secondary)]">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[var(--ink-accent)]" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[var(--ink-accent)]" />
                {article.readTimeMinutes} min de lectura
              </span>
            </div>
          </div>

          {/* Main Cover Image */}
          <div className="mb-8">
            <div
              onClick={() => handleOpenGallery(0)}
              className="group cursor-pointer relative overflow-hidden border-2 border-[var(--paper-border)] bg-[var(--paper-subtle)] shadow-sm"
            >
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full max-h-[550px] object-cover vintage-photo group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-black/75 text-white font-typewriter text-xs px-2.5 py-1 rounded-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3.5 h-3.5 text-amber-300" />
                <span>Haga clic para ampliar</span>
              </div>
            </div>
            {article.coverCaption && (
              <p className="mt-2 font-body text-xs sm:text-sm italic text-[var(--ink-muted)] border-b border-[var(--paper-border-light)] pb-1.5">
                {article.coverCaption}
              </p>
            )}
          </div>

          {/* Additional Photos Gallery (if 1 or more extra photos exist) */}
          {article.gallery && article.gallery.length > 0 && (
            <div className="mb-10 bg-[var(--paper-subtle)]/40 p-4 border border-[var(--paper-border-light)]">
              <div className="flex items-center justify-between mb-3 border-b border-[var(--paper-border-light)] pb-2 font-typewriter">
                <span className="text-xs uppercase font-bold text-[var(--ink-accent)] flex items-center gap-1.5">
                  <Camera className="w-4 h-4" />
                  Archivo Fotográfico Complementario ({article.gallery.length} fotos)
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">Toque cualquier fotografía para inspeccionar</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {article.gallery.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    onClick={() => handleOpenGallery(idx + 1)}
                    className="group cursor-pointer border border-[var(--paper-border)] bg-[var(--paper-card)] p-1.5 shadow-2xs hover:border-[var(--ink-accent)] transition-all"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-black/10">
                      <img
                        src={photo.url}
                        alt={photo.caption || `Fotografía ${idx + 1}`}
                        className="w-full h-full object-cover vintage-photo group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {photo.caption && (
                      <p className="mt-1.5 font-body text-[11px] italic text-[var(--ink-secondary)] line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article Body Content */}
          <div className="space-y-6 text-base sm:text-lg leading-relaxed font-body text-[var(--ink-primary)]">
            {article.content && article.content.length > 0 ? (
              article.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={idx === 0 ? 'newspaper-dropcap' : 'text-justify indent-6'}
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p>Sin contenido adicional registrado en el archivo.</p>
            )}

            {/* Vintage Pull Quote */}
            {article.pullQuote && (
              <blockquote className="vintage-pullquote my-8">
                {article.pullQuote}
              </blockquote>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t-2 border-[var(--paper-border-light)] flex flex-wrap items-center gap-2 font-typewriter text-xs">
              <span className="text-[var(--ink-muted)] uppercase font-bold mr-1">Palabras Clave:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[var(--paper-subtle)] border border-[var(--paper-border-light)] px-2.5 py-0.5 text-[var(--ink-secondary)] font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Cartas de Lectores / Comentarios */}
          <section className="mt-12 pt-8 border-t-4 border-double border-[var(--paper-border)]">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--paper-border-light)] font-typewriter">
              <h3 className="text-base sm:text-lg font-bold uppercase text-[var(--ink-primary)] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[var(--ink-accent)]" />
                Cartas de Lectores ({article.comments?.length || 0})
              </h3>
              <span className="text-xs text-[var(--ink-muted)]">Correspondencia abierta</span>
            </div>

            {/* Comments List */}
            <div className="space-y-4 mb-8">
              {article.comments && article.comments.length > 0 ? (
                article.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-[var(--paper-subtle)]/30 border border-[var(--paper-border-light)] p-4 relative"
                  >
                    <div className="flex items-center justify-between mb-2 font-typewriter text-xs border-b border-[var(--paper-border-light)]/50 pb-1.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-[var(--ink-primary)] font-bold">{comment.author}</strong>
                        {comment.city && (
                          <span className="text-[var(--ink-muted)]">({comment.city})</span>
                        )}
                      </div>
                      <span className="text-[var(--ink-muted)]">{comment.date}</span>
                    </div>
                    <p className="font-body text-sm text-[var(--ink-secondary)] italic leading-relaxed">
                      «{comment.text}»
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-body italic text-sm text-[var(--ink-muted)] py-3 text-center">
                  Aún no se han recibido cartas para esta edición. Sea el primero en enviar sus impresiones a la redacción.
                </p>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-[var(--paper-subtle)]/50 p-4 sm:p-6 border border-[var(--paper-border)]">
              <h4 className="font-typewriter text-xs uppercase font-bold text-[var(--ink-accent)] mb-4 tracking-wider">
                Escribir a la Dirección del Diario
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block font-typewriter text-[11px] uppercase text-[var(--ink-secondary)] mb-1">
                    Su Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Don Manuel Belgrano"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-full bg-[var(--paper-card)] border border-[var(--paper-border)] px-3 py-1.5 text-xs font-typewriter text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-accent)]"
                  />
                </div>
                <div>
                  <label className="block font-typewriter text-[11px] uppercase text-[var(--ink-secondary)] mb-1">
                    Barrio / Ciudad
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. San Nicolás, Buenos Aires"
                    value={commentCity}
                    onChange={(e) => setCommentCity(e.target.value)}
                    className="w-full bg-[var(--paper-card)] border border-[var(--paper-border)] px-3 py-1.5 text-xs font-typewriter text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-accent)]"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-typewriter text-[11px] uppercase text-[var(--ink-secondary)] mb-1">
                  Texto de su Carta *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Comparta su testimonio, memoria o comentario sobre esta crónica..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-[var(--paper-card)] border border-[var(--paper-border)] px-3 py-2 text-xs font-body text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-accent)]"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white font-typewriter text-xs uppercase font-bold rounded-xs transition-colors flex items-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Carta al Buzón</span>
              </button>
            </form>
          </section>
        </article>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-[var(--paper-border)]">
              <span className="font-headline text-2xl font-bold uppercase text-[var(--ink-primary)]">
                Más Crónicas del Archivo
              </span>
              <div className="h-0.5 grow bg-[var(--paper-border-light)]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} layout="standard" />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Lightbox Photo Gallery Modal */}
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
