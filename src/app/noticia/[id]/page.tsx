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
import { recordPageView } from '../../../lib/analytics';

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
        recordPageView(`/noticia/${found.id}`, found.title);
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
      <div className="min-h-screen flex flex-col bg-white text-[#111111]">
        <Header />
        <main className="grow max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="font-headline text-2xl font-bold mb-3">
            Artículo no encontrado
          </h2>
          <p className="font-body text-sm text-[#777777] mb-6">
            La crónica solicitada no existe o fue retirada.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#333333] text-white font-body text-xs rounded transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al inicio</span>
          </Link>
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
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      <Header />

      <main className="grow max-w-3xl mx-auto px-4 py-10 sm:py-14 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-2 mb-8 text-xs font-body text-[#888888]">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-[#111111] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Portada</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <span className="uppercase font-medium text-[#111111]">{article.category}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
        </div>

        {/* Article Content */}
        <article className="space-y-8">
          {/* Header & Title */}
          <div className="space-y-4">
            {article.subtitle && (
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#777777]">
                {article.subtitle}
              </p>
            )}

            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#111111]">
              {article.title}
            </h1>

            <p className="font-body text-lg sm:text-xl text-[#444444] italic leading-relaxed pt-2">
              «{article.copete}»
            </p>
          </div>

          {/* Byline & Share Tools */}
          <div className="py-4 border-y border-[#eeeeee] flex flex-wrap items-center justify-between gap-4 text-xs font-body text-[#888888]">
            <div>
              <span className="font-medium text-[#111111]">Por {article.author}</span>
              {article.authorRole && <span> — {article.authorRole}</span>}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handlePrint}
                className="hover:text-[#111111] transition-colors flex items-center gap-1"
                title="Imprimir"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>

              <button
                onClick={handleShare}
                className="hover:text-[#111111] transition-colors flex items-center gap-1"
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
              className="cursor-pointer relative overflow-hidden bg-[#f7f7f7] group"
            >
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full max-h-[520px] object-cover minimal-photo"
              />
              <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-body px-2 py-0.5 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3 h-3" />
                <span>Ampliar foto</span>
              </div>
            </div>
            {article.coverCaption && (
              <p className="mt-2 font-body text-xs italic text-[#777777]">
                {article.coverCaption}
              </p>
            )}
          </div>

          {/* Additional Photos Gallery (if any) */}
          {article.gallery && article.gallery.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3 text-xs font-body text-[#888888]">
                <Camera className="w-3.5 h-3.5 text-[#111111]" />
                <span className="font-semibold uppercase tracking-wider">Fotografías adicionales ({article.gallery.length})</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {article.gallery.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    onClick={() => handleOpenGallery(idx + 1)}
                    className="cursor-pointer overflow-hidden bg-[#f7f7f7] group"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.caption || `Foto ${idx + 1}`}
                        className="w-full h-full object-cover minimal-photo"
                      />
                    </div>
                    {photo.caption && (
                      <p className="p-1.5 font-body text-[11px] italic text-[#666666] line-clamp-1">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paragraphs */}
          <div className="space-y-6 text-base sm:text-lg leading-relaxed font-body text-[#222222] pt-4">
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

          {/* Comments Section */}
          <section className="pt-10 border-t border-[#eeeeee]">
            {(() => {
              const visibleComments = (article.comments || []).filter((c) => !c.hidden);
              return (
                <>
                  <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#111111]" />
                    Comentarios ({visibleComments.length})
                  </h3>

                  {/* Comments List */}
                  <div className="space-y-4 mb-8">
                    {visibleComments.length > 0 ? (
                      visibleComments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-[#fafafa] border border-[#f0f0f0] p-4 rounded-xs"
                        >
                          <div className="flex items-center justify-between text-xs font-body text-[#888888] mb-1.5">
                            <strong className="text-[#111111] font-medium">{comment.author}</strong>
                            <span>{comment.date}</span>
                          </div>
                          <p className="font-body text-sm text-[#444444] italic">
                            «{comment.text}»
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-body italic text-[#888888]">
                        No hay comentarios aún.
                      </p>
                    )}
                  </div>
                </>
              );
            })()}

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-[#666666]">
                Dejar un comentario
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Tu nombre *"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="bg-[#fafafa] border border-[#e5e5e5] px-3 py-2 text-xs font-body text-[#111111] focus:outline-hidden focus:border-[#111111] rounded-xs"
                />
                <input
                  type="text"
                  placeholder="Ciudad / Barrio (opcional)"
                  value={commentCity}
                  onChange={(e) => setCommentCity(e.target.value)}
                  className="bg-[#fafafa] border border-[#e5e5e5] px-3 py-2 text-xs font-body text-[#111111] focus:outline-hidden focus:border-[#111111] rounded-xs"
                />
              </div>

              <textarea
                required
                rows={3}
                placeholder="Escribe tu mensaje..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3 py-2 text-xs font-body text-[#111111] focus:outline-hidden focus:border-[#111111] rounded-xs"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-body font-medium rounded-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>Publicar</span>
              </button>
            </form>
          </section>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-14 pt-10 border-t border-[#eeeeee]">
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
