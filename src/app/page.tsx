'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BreakingTicker from '../components/BreakingTicker';
import ArticleCard from '../components/ArticleCard';
import { Article, ClassifiedAd } from '../types/blog';
import { getStoredArticles, getStoredClassifieds } from '../lib/storage';
import { VINTAGE_EPHEMERIDES } from '../data/initialArticles';
import { playTypewriterClick, playPageTurn } from '../lib/soundEffects';
import {
  Calendar,
  Sparkles,
  Search,
  BookOpen,
  HelpCircle,
  Tag,
  Clock,
  TrendingUp,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [classifieds, setClassifieds] = useState<ClassifiedAd[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas las Secciones');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDecade, setSelectedDecade] = useState<number | null>(null);

  useEffect(() => {
    playPageTurn();
    const loaded = getStoredArticles();
    setArticles(loaded);
    setClassifieds(getStoredClassifieds());

    const handleUpdate = () => {
      setArticles(getStoredArticles());
      setClassifieds(getStoredClassifieds());
    };
    window.addEventListener('noticias_articles_updated', handleUpdate);
    return () => window.removeEventListener('noticias_articles_updated', handleUpdate);
  }, []);

  // Filter articles based on Category, Search query, and Decade
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'Todas las Secciones' || article.category === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.copete.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesDecade =
      selectedDecade === null ||
      (article.epochYear >= selectedDecade && article.epochYear < selectedDecade + 10);

    return matchesCategory && matchesSearch && matchesDecade;
  });

  // Hero article: either the first marked as featured, or the first filtered article
  const heroArticle = filteredArticles.find((a) => a.featured) || filteredArticles[0];
  const secondaryArticles = heroArticle
    ? filteredArticles.filter((a) => a.id !== heroArticle.id)
    : filteredArticles;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper-bg)] text-[var(--ink-primary)]">
      {/* Newspaper Masthead & Navigation */}
      <Header
        currentCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedDecade(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Telegram Wire Ticker */}
      <BreakingTicker articles={articles} />

      {/* Main Newspaper Front Page */}
      <main className="grow max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Decade / Epoch Quick Filter Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-[var(--paper-subtle)]/40 p-2.5 border border-[var(--paper-border-light)] font-typewriter text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[var(--ink-accent)]" />
            <span className="font-bold uppercase text-[var(--ink-secondary)]">Filtrar por Época:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                playTypewriterClick();
                setSelectedDecade(null);
              }}
              className={`px-2 py-0.5 border rounded-xs transition-colors ${
                selectedDecade === null
                  ? 'bg-[var(--ink-primary)] text-white border-[var(--ink-primary)]'
                  : 'bg-[var(--paper-card)] border-[var(--paper-border-light)] hover:bg-[var(--paper-subtle)]'
              }`}
            >
              Todas las Épocas
            </button>
            {[1900, 1920, 1960, 1970, 1980].map((decade) => (
              <button
                key={decade}
                onClick={() => {
                  playTypewriterClick();
                  setSelectedDecade(selectedDecade === decade ? null : decade);
                }}
                className={`px-2 py-0.5 border rounded-xs transition-colors ${
                  selectedDecade === decade
                    ? 'bg-[var(--ink-accent)] text-white border-[var(--ink-accent)]'
                    : 'bg-[var(--paper-card)] border-[var(--paper-border-light)] hover:bg-[var(--paper-subtle)]'
                }`}
              >
                Años {decade}s
              </button>
            ))}
          </div>
        </div>

        {/* Filter State Banner if search or filter is active */}
        {(selectedCategory !== 'Todas las Secciones' || searchQuery || selectedDecade !== null) && (
          <div className="mb-6 flex items-center justify-between bg-[var(--paper-card)] border border-[var(--ink-accent)] px-4 py-2 font-typewriter text-xs">
            <div>
              <span>Mostrando resultados para: </span>
              {selectedCategory !== 'Todas las Secciones' && (
                <strong className="text-[var(--ink-accent)] mr-2">[{selectedCategory}]</strong>
              )}
              {selectedDecade !== null && (
                <strong className="text-[var(--ink-secondary)] mr-2">[Década {selectedDecade}s]</strong>
              )}
              {searchQuery && (
                <span className="italic">«{searchQuery}»</span>
              )}
              <span> ({filteredArticles.length} crónicas halladas)</span>
            </div>

            <button
              onClick={() => {
                playTypewriterClick();
                setSelectedCategory('Todas las Secciones');
                setSearchQuery('');
                setSelectedDecade(null);
              }}
              className="text-[var(--ink-accent)] font-bold hover:underline uppercase"
            >
              Limpiar Filtros
            </button>
          </div>
        )}

        {/* Empty Search Result State */}
        {filteredArticles.length === 0 && (
          <div className="bg-[var(--paper-card)] border-2 border-[var(--paper-border)] p-12 text-center my-8">
            <span className="vintage-stamp mb-3 inline-block">SIN REGISTRO</span>
            <h3 className="font-headline text-2xl font-bold uppercase mb-2">
              No se hallaron crónicas con esos criterios
            </h3>
            <p className="font-body text-sm text-[var(--ink-secondary)] mb-6">
              Pruebe buscando por otro término, o seleccione otra sección del archivo.
            </p>
            <button
              onClick={() => {
                playTypewriterClick();
                setSelectedCategory('Todas las Secciones');
                setSearchQuery('');
                setSelectedDecade(null);
              }}
              className="px-4 py-2 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white font-typewriter text-xs uppercase font-bold transition-colors"
            >
              Restablecer Búsqueda
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        {filteredArticles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Main Editorial Area (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Hero Big Headline Story */}
              {heroArticle && (
                <ArticleCard article={heroArticle} layout="hero" />
              )}

              {/* Secondary Articles Newspaper Grid */}
              {secondaryArticles.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 my-6 pb-2 border-b-2 border-[var(--paper-border)]">
                    <h3 className="font-headline text-2xl font-black uppercase text-[var(--ink-primary)]">
                      Otras Crónicas de Primera Plana
                    </h3>
                    <div className="h-0.5 grow bg-[var(--paper-border-light)]" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {secondaryArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        layout="standard"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Newspaper Sidebar (4 cols) */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Sidebar Box 1: Efemérides Históricas */}
              <div className="bg-[var(--paper-card)] border-2 border-[var(--paper-border)] p-4 shadow-xs">
                <div className="border-b-2 border-[var(--paper-border)] pb-2 mb-3 flex items-center justify-between font-typewriter">
                  <span className="text-xs uppercase font-bold text-[var(--ink-accent)] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Efemérides del Pasado
                  </span>
                  <span className="text-[10px] text-[var(--ink-muted)]">Archivo Histórico</span>
                </div>

                <div className="space-y-3 font-body text-xs">
                  {VINTAGE_EPHEMERIDES.map((efe, idx) => (
                    <div
                      key={idx}
                      className="border-b border-[var(--paper-border-light)] pb-2 last:border-none last:pb-0"
                    >
                      <strong className="font-typewriter text-[var(--ink-accent)] text-xs block mb-0.5">
                        AÑO {efe.year}:
                      </strong>
                      <p className="text-[var(--ink-secondary)] leading-relaxed italic">
                        «{efe.text}»
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Box 2: Avisos Clasificados Vintage */}
              <div className="bg-[var(--paper-card)] border-2 border-[var(--paper-border)] p-4 shadow-xs">
                <div className="border-b-2 border-[var(--paper-border)] pb-2 mb-3 flex items-center justify-between font-typewriter">
                  <span className="text-xs uppercase font-bold text-[var(--ink-primary)] flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[var(--ink-accent)]" />
                    Avisos Clasificados de Época
                  </span>
                  <span className="text-[10px] bg-[var(--paper-subtle)] px-1.5 py-0.5 border border-[var(--paper-border-light)]">
                    SECCIÓN ECONOMÍA
                  </span>
                </div>

                <div className="space-y-3 font-typewriter text-[11px]">
                  {classifieds.slice(0, 4).map((ad) => (
                    <div
                      key={ad.id}
                      className="bg-[var(--paper-subtle)]/30 border border-[var(--paper-border-light)] p-2.5 hover:border-[var(--ink-accent)] transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[var(--ink-accent)] font-bold mb-1">
                        <span>{ad.category}</span>
                        {ad.price && <span>{ad.price}</span>}
                      </div>
                      <strong className="font-headline text-xs font-bold text-[var(--ink-primary)] block mb-1">
                        {ad.title}
                      </strong>
                      <p className="text-[var(--ink-secondary)] font-body text-[11px] mb-1">
                        {ad.description}
                      </p>
                      <span className="text-[10px] text-[var(--ink-muted)] block italic">
                        {ad.contact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Box 3: Frase Célebre del Día */}
              <div className="bg-[var(--paper-subtle)] p-4 border border-[var(--paper-border)] text-center relative overflow-hidden">
                <span className="font-typewriter text-[10px] uppercase font-bold tracking-widest text-[var(--ink-muted)] block mb-2">
                  — PENSAMIENTO DE ÉPOCA —
                </span>
                <blockquote className="font-headline italic text-sm text-[var(--ink-primary)] mb-2 leading-relaxed">
                  «El pasado nunca muere, ni siquiera es pasado. Permanece vivo en cada página que volvemos a leer».
                </blockquote>
                <cite className="font-typewriter text-[11px] font-bold text-[var(--ink-accent)] block not-italic">
                  — William Faulkner (1951)
                </cite>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
