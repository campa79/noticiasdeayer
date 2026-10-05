'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import { Article } from '../types/blog';
import { getStoredArticles } from '../lib/storage';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loaded = getStoredArticles();
    setArticles(loaded);

    const handleUpdate = () => {
      setArticles(getStoredArticles());
    };
    window.addEventListener('noticias_articles_updated', handleUpdate);
    return () => window.removeEventListener('noticias_articles_updated', handleUpdate);
  }, []);

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'Todas' ||
      selectedCategory === 'Todas las Secciones' ||
      article.category === selectedCategory ||
      (selectedCategory === 'Sociedad' && article.category.includes('Sociedad'));

    const matchesSearch =
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.copete.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const heroArticle = filteredArticles.find((a) => a.featured) || filteredArticles[0];
  const otherArticles = heroArticle
    ? filteredArticles.filter((a) => a.id !== heroArticle.id)
    : filteredArticles;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper-bg)] text-[var(--ink-primary)]">
      <Header
        currentCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="grow max-w-5xl mx-auto px-4 py-8 sm:py-12 w-full space-y-10 sm:space-y-14">
        {/* Active Filter Notice */}
        {(selectedCategory !== 'Todas' || searchQuery) && (
          <div className="flex items-center justify-between border-b border-[var(--paper-border)] pb-3 text-xs font-body text-[var(--ink-secondary)]">
            <div>
              <span>Filtrado por: </span>
              {selectedCategory !== 'Todas' && (
                <strong className="text-[var(--ink-accent)] mr-2">[{selectedCategory}]</strong>
              )}
              {searchQuery && <span className="italic">«{searchQuery}»</span>}
              <span> ({filteredArticles.length} resultados)</span>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('Todas');
                setSearchQuery('');
              }}
              className="text-[var(--ink-accent)] hover:underline font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="bg-[var(--paper-card)] border border-[var(--paper-border)] p-12 text-center my-8">
            <h3 className="font-headline text-xl font-bold mb-2">
              No se encontraron crónicas
            </h3>
            <p className="font-body text-sm text-[var(--ink-muted)] mb-4">
              Pruebe buscando con otra palabra o seleccionando otra categoría.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todas');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[var(--ink-primary)] text-white text-xs font-body rounded hover:bg-[var(--ink-accent)] transition-colors"
            >
              Ver todas las noticias
            </button>
          </div>
        )}

        {/* Hero Article */}
        {heroArticle && (
          <section>
            <ArticleCard article={heroArticle} layout="hero" />
          </section>
        )}

        {/* Other Articles Grid */}
        {otherArticles.length > 0 && (
          <section>
            <div className="border-b border-[var(--paper-border)] pb-2 mb-6">
              <h3 className="font-headline text-xl font-bold uppercase tracking-wide text-[var(--ink-primary)]">
                Crónicas Recientes
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {otherArticles.map((article) => (
                <ArticleCard key={article.id} article={article} layout="standard" />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
